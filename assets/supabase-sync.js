/**
 * Workspace Dashboard — Supabase Cloud Sync Engine (V2 Advanced)
 * Features:
 * - 0ms Local-First Latency (intercepts localStorage)
 * - Multi-Tab BroadcastChannel Bridge (instant sync between open tabs)
 * - Supabase Realtime WebSocket (Phoenix protocol, live cross-device sync)
 * - Conflict-Free Granular Reconciler (ID-level todo & habit merging)
 * - Cloud Time Machine (Point-in-time snapshots & 1-click restore)
 * - 1-Click Mobile Device Pairing (QR Code & Deep Links)
 * - Offline Queue & Service Worker Background Sync
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.WorkspaceSync = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const DEFAULT_CONFIG = {
        url: 'https://cpagjchpwbsqjwnjnigk.supabase.co',
        key: 'sb_publishable_5iMG-eox9sPl_Z1hB3FEpQ_rB4fBjoY',
        tableName: 'workspace_state'
    };

    const STORAGE_CONFIG_KEY = 'supabase_custom_config';
    const STORAGE_TIMESTAMPS_KEY = 'supabase_key_timestamps';
    const STORAGE_LAST_SYNC_KEY = 'supabase_last_sync_time';
    const STORAGE_SYNC_QUEUE_KEY = 'supabase_sync_queue';
    const BROADCAST_CHANNEL_NAME = 'workspace_tab_sync_v2';

    // Unique ID for this browser tab session to avoid echoing self broadcasts
    const TAB_ID = 'tab_' + Math.random().toString(36).substring(2, 9);

    const TRACKED_KEYS = [
        'dashboard_deleted_tasks',
        'dashboard_deleted_objectives',
        'dashboard_deleted_habits',
        'dashboard_todos',
        'dashboard_habits',
        'dashboard_calendar_events',
        'dashboard_calendar_view',
        'dashboard_calendar_show_hijri',
        'dashboard_objectives',
        'dashboard_objectives_archive',
        'dashboard_objectives_active_month',
        'dashboard_objectives_active_week',
        'productivity_completion_dates',
        'dashboard_last_recurrence_check',
        'nofap_start_date',
        'nofap_streak_history',
        'dashboard_secret_pin_hash',
        'dashboard_schema_version',
        'calisthenics_program_v1',
        'calisthenics_history_v1',
        'calisthenics_active_session_v1',
        'calisthenics_recommendations_v1',
        'calisthenics_readiness_v1',
        'calisthenics_goals_v1',
        'calisthenics_prs_v1',
        'academy_progress_v1',
        'academy_notes_v1',
        'academy_active_track',
        'dashboard_theme',
        'theme'
    ];

    const SQL_SETUP_SCRIPT = `-- ==============================================================================
-- Workspace Dashboard — Supabase Database Setup
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cpagjchpwbsqjwnjnigk/sql/new
-- ==============================================================================

-- 1. Create table to store dashboard state & keys
CREATE TABLE IF NOT EXISTS public.workspace_state (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.workspace_state ENABLE ROW LEVEL SECURITY;

-- 3. Create permissive access policy for client publishable key
DROP POLICY IF EXISTS "Allow public access with publishable key" ON public.workspace_state;
CREATE POLICY "Allow public access with publishable key"
ON public.workspace_state
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 4. Enable Realtime updates
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'workspace_state'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_state;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

-- Verify setup
SELECT count(*) AS total_keys FROM public.workspace_state;`;

    let config = { ...DEFAULT_CONFIG };
    let syncStatus = 'idle'; // 'idle' | 'checking' | 'syncing' | 'synced' | 'needs_setup' | 'error' | 'offline'
    let statusMessage = '';
    let realtimeConnected = false;
    let pendingPushMap = new Map();
    let debounceTimer = null;
    let isApplyingRemote = false;
    let isInitialized = false;

    // Cross-tab broadcast channel
    let broadcastChannel = null;

    // Realtime WebSocket
    let realtimeSocket = null;
    let realtimeHeartbeatInterval = null;
    let realtimeReconnectTimeout = null;
    let phoenixMessageRef = 1;

    // Load saved or URL-injected pairing configuration
    try {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const pairUrl = urlParams.get('sb_url');
            const pairKey = urlParams.get('sb_key');

            if (pairUrl && pairKey) {
                config.url = pairUrl;
                config.key = pairKey;
                localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify({ url: pairUrl, key: pairKey }));
                // Clean URL parameters cleanly without reload
                urlParams.delete('sb_url');
                urlParams.delete('sb_key');
                const newQuery = urlParams.toString() ? '?' + urlParams.toString() : '';
                window.history.replaceState({}, document.title, window.location.pathname + newQuery);
            } else {
                const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.url && parsed.key) config = { ...config, ...parsed };
                }
            }
        }
    } catch (_) {}

    function isOnline() {
        if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
            return navigator.onLine;
        }
        return true;
    }

    function getLocalTimestamps() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_TIMESTAMPS_KEY) || '{}');
        } catch {
            return {};
        }
    }

    function setLocalTimestamp(key, timeIso) {
        try {
            const stamps = getLocalTimestamps();
            stamps[key] = timeIso || new Date().toISOString();
            localStorage.setItem(STORAGE_TIMESTAMPS_KEY, JSON.stringify(stamps));
        } catch (_) {}
    }

    function setStatus(status, message) {
        syncStatus = status;
        statusMessage = message || '';
        const lastSync = (typeof localStorage !== 'undefined') ? localStorage.getItem(STORAGE_LAST_SYNC_KEY) : null;

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('supabase-sync-status', {
                detail: { status, message: statusMessage, lastSync, config, realtimeConnected }
            }));
            updateDomIndicators(status, message);
        }
    }

    function setRealtimeStatus(connected) {
        realtimeConnected = connected;
        const badge = document.getElementById('supabaseRealtimeBadge');
        if (badge) {
            badge.className = 'supabase-mode-pill ' + (connected ? 'realtime-live' : 'realtime-off');
            badge.innerHTML = connected 
                ? '<span class="realtime-dot"></span> Realtime Live' 
                : '<span class="realtime-dot off"></span> Realtime Inactive';
        }
    }

    function updateDomIndicators(status, message) {
        if (typeof document === 'undefined') return;

        document.querySelectorAll('.cloud-status-dot').forEach(el => {
            el.className = 'cloud-status-dot status-' + status;
        });

        document.querySelectorAll('.cloud-sync-btn, .cloud-sync-status').forEach(btn => {
            let label = 'Supabase: ' + status;
            if (status === 'synced') label = realtimeConnected ? 'Supabase: Synced & Realtime Live' : 'Supabase: Synced';
            else if (status === 'syncing') label = 'Supabase: Syncing...';
            else if (status === 'needs_setup') label = 'Supabase: Setup table required';
            else if (status === 'error') label = 'Supabase: Connection error';
            else if (status === 'offline') label = 'Supabase: Offline';

            btn.setAttribute('title', message ? `${label} (${message})` : label);
            btn.setAttribute('data-sync-status', status);

            const textSpan = btn.querySelector('.sync-text');
            if (textSpan) {
                if (status === 'synced') textSpan.textContent = 'Synced';
                else if (status === 'syncing') textSpan.textContent = 'Syncing...';
                else if (status === 'needs_setup') textSpan.textContent = 'Setup needed';
                else if (status === 'offline') textSpan.textContent = 'Offline';
                else if (status === 'error') textSpan.textContent = 'Error';
                else textSpan.textContent = 'Cloud';
            }
        });

        const modalStatusEl = document.getElementById('supabaseModalStatusText');
        if (modalStatusEl) {
            let text = 'Connected & Synced';
            let color = '#10b981';
            if (status === 'syncing') { text = 'Syncing data...'; color = '#38bdf8'; }
            else if (status === 'needs_setup') { text = 'Action Required: Run SQL setup in Supabase'; color = '#f59e0b'; }
            else if (status === 'error') { text = 'Error: ' + (message || 'Unable to connect'); color = '#ef4444'; }
            else if (status === 'offline') { text = 'Offline (local changes preserved)'; color = '#94a3b8'; }
            else if (status === 'checking') { text = 'Checking cloud status...'; color = '#38bdf8'; }

            modalStatusEl.textContent = text;
            modalStatusEl.style.color = color;
        }

        const setupAlertEl = document.getElementById('supabaseSetupAlert');
        if (setupAlertEl) {
            setupAlertEl.style.display = (status === 'needs_setup') ? 'block' : 'none';
        }

        const lastSyncLabel = document.getElementById('supabaseLastSyncLabel');
        if (lastSyncLabel) {
            const last = localStorage.getItem(STORAGE_LAST_SYNC_KEY);
            lastSyncLabel.textContent = last ? new Date(last).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Never';
        }
    }

    function buildHeaders() {
        return {
            'apikey': config.key,
            'Authorization': `Bearer ${config.key}`,
            'Content-Type': 'application/json'
        };
    }

    function serializeValue(val) {
        if (val === null || val === undefined) return null;
        try {
            return JSON.parse(val);
        } catch {
            return val;
        }
    }

    function deserializeValue(val) {
        if (val === null || val === undefined) return '';
        if (typeof val === 'string') return val;
        return JSON.stringify(val);
    }

    // =========================================================================
    // 1. Conflict-Free Granular Reconciler (ID-level merging)
    // =========================================================================

    function getDeletedTaskTombstones() {
        try {
            const raw = localStorage.getItem('dashboard_deleted_tasks');
            if (!raw) return new Set();
            const obj = JSON.parse(raw);
            const set = new Set();
            if (Array.isArray(obj)) {
                obj.forEach(x => {
                    const s = String(x || '').trim();
                    if (s) set.add(s.toLowerCase());
                });
            } else if (typeof obj === 'object' && obj !== null) {
                Object.keys(obj).forEach(x => {
                    const s = String(x || '').trim();
                    if (s) set.add(s.toLowerCase());
                });
            }
            return set;
        } catch {
            return new Set();
        }
    }

    function mergeTodos(localRaw, remoteRaw) {
        try {
            const localObj = typeof localRaw === 'object' && localRaw !== null ? localRaw : JSON.parse(localRaw || '{}');
            const remoteObj = typeof remoteRaw === 'object' && remoteRaw !== null ? remoteRaw : JSON.parse(remoteRaw || '{}');
            const categories = ['lang', 'cyber', 'train', 'din', 'work', 'proj'];
            const merged = {};
            const tombstones = getDeletedTaskTombstones();

            categories.forEach(cat => {
                const localList = Array.isArray(localObj[cat]) ? localObj[cat] : [];
                const remoteList = Array.isArray(remoteObj[cat]) ? remoteObj[cat] : [];
                const itemMap = new Map();

                // 1. Seed with remote items (exclude tombstones by ID only)
                remoteList.forEach(item => {
                    if (!item) return;
                    const normId = String(item.id || '').trim().toLowerCase();
                    if (normId && tombstones.has(normId)) {
                        return; // DELETED! Do not resurrect!
                    }
                    if (item.id) itemMap.set(item.id, { ...item });
                });

                // 2. Reconcile local items with title matching and timestamp conflict resolution
                localList.forEach(item => {
                    if (!item) return;
                    const normId = String(item.id || '').trim().toLowerCase();
                    // A local copy can be stale while another client has
                    // deleted it. Tombstones must win or an old mobile/web
                    // cache will put the task back into Supabase.
                    if (normId && tombstones.has(normId)) {
                        return;
                    }

                    const normText = (item.text || '').trim().toLowerCase();
                    let targetKey = item.id;

                    // If exact ID is not in itemMap, check if a remote item with the same normalized text exists
                    if (!itemMap.has(targetKey) && normText) {
                        for (const [k, v] of itemMap.entries()) {
                            if ((v.text || '').trim().toLowerCase() === normText) {
                                targetKey = k;
                                break;
                            }
                        }
                    }

                    if (!itemMap.has(targetKey)) {
                        itemMap.set(item.id, { ...item });
                    } else {
                        const existing = itemMap.get(targetKey);
                        const locTime = Number(item.updatedAt || 0);
                        const remTime = Number(existing.updatedAt || 0);

                        if (locTime > remTime) {
                            // Local is newer -> adopt local state, preserving canonical remote ID if matched by title
                            itemMap.set(targetKey, { ...item, id: targetKey });
                        } else {
                            // Remote is newer or equal -> keep remote state
                            itemMap.set(targetKey, { ...existing });
                        }
                    }
                });

                // 3. Strict deduplication pass by normalized title within category (matches Flutter sync_manager)
                const seenByTitle = new Map();
                for (const item of itemMap.values()) {
                    if (!item || typeof item.text !== 'string') continue;
                    const normText = item.text.trim().toLowerCase();
                    if (!normText) continue;

                    if (!seenByTitle.has(normText)) {
                        seenByTitle.set(normText, item);
                    } else {
                        const existing = seenByTitle.get(normText);
                        const itemTime = Number(item.updatedAt || 0);
                        const exTime = Number(existing.updatedAt || 0);
                        if (itemTime > exTime) {
                            seenByTitle.set(normText, item);
                        }
                    }
                }

                merged[cat] = Array.from(seenByTitle.values());
            });

            return JSON.stringify(merged);
        } catch {
            return localRaw || deserializeValue(remoteRaw);
        }
    }

    function getDeletedHabitTombstones() {
        try {
            const raw = localStorage.getItem('dashboard_deleted_habits');
            if (!raw) return new Set();
            const obj = JSON.parse(raw);
            const set = new Set();
            if (Array.isArray(obj)) {
                obj.forEach(x => { const s = String(x || '').trim(); if (s) set.add(s); });
            } else if (typeof obj === 'object' && obj !== null) {
                Object.keys(obj).forEach(x => { const s = String(x || '').trim(); if (s) set.add(s); });
            }
            return set;
        } catch {
            return new Set();
        }
    }

    function mergeHabits(localRaw, remoteRaw) {
        try {
            const localList = Array.isArray(localRaw) ? localRaw : JSON.parse(localRaw || '[]');
            const remoteList = typeof remoteRaw === 'object' && Array.isArray(remoteRaw) ? remoteRaw : JSON.parse(remoteRaw || '[]');
            const habitMap = new Map();
            const tombstones = getDeletedHabitTombstones();

            // 1. Seed with remote habits (excluding deleted tombstones)
            remoteList.forEach(h => {
                if (!h || !h.id) return;
                if (tombstones.has(String(h.id))) return;
                habitMap.set(String(h.id), { ...h, history: { ...(h.history || {}) } });
            });

            // 2. Reconcile with local habits
            localList.forEach(h => {
                if (!h || !h.id) return;
                const id = String(h.id);
                if (tombstones.has(id)) return;

                if (!habitMap.has(id)) {
                    habitMap.set(id, { ...h, history: { ...(h.history || {}) } });
                } else {
                    const existing = habitMap.get(id);
                    const localTime = Number(h.updatedAt || 0);
                    const remoteTime = Number(existing.updatedAt || 0);

                    const newer = (localTime > remoteTime) ? h : existing;
                    const older = (localTime > remoteTime) ? existing : h;

                    const mergedHistory = { ...(older.history || {}) };
                    if (newer.history && typeof newer.history === 'object') {
                        for (const [date, count] of Object.entries(newer.history)) {
                            mergedHistory[date] = Number(count) || 0;
                        }
                    }

                    habitMap.set(id, {
                        ...older,
                        ...newer,
                        history: mergedHistory,
                        updatedAt: Math.max(localTime, remoteTime) || Date.now()
                    });
                }
            });

            return JSON.stringify(Array.from(habitMap.values()));
        } catch {
            return localRaw || deserializeValue(remoteRaw);
        }
    }

    function mergeObjectives(localRaw, remoteRaw) {
        try {
            const localObj = typeof localRaw === 'object' && localRaw !== null ? localRaw : JSON.parse(localRaw || '{}');
            const remoteObj = typeof remoteRaw === 'object' && remoteRaw !== null ? remoteRaw : JSON.parse(remoteRaw || '{}');
            const periods = ['yearly', 'monthly', 'weekly'];
            const merged = {};
            let deleted = {};
            try { deleted = JSON.parse(localStorage.getItem('dashboard_deleted_objectives') || '{}'); } catch (_) {}

            periods.forEach(p => {
                const locList = Array.isArray(localObj[p]) ? localObj[p] : [];
                const remList = Array.isArray(remoteObj[p]) ? remoteObj[p] : [];
                const objMap = new Map();

                remList.forEach(item => {
                    if (item && item.id && !deleted[item.id]) objMap.set(item.id, { ...item });
                });

                locList.forEach(item => {
                    if (!item || !item.id) return;
                    // A stale device must not restore a deleted goal/target.
                    if (deleted[item.id]) return;
                    const normText = (item.text || '').trim().toLowerCase();
                    let key = item.id;
                    if (!objMap.has(key) && normText) {
                        for (const [k, v] of objMap.entries()) {
                            if ((v.text || '').trim().toLowerCase() === normText) {
                                key = k;
                                break;
                            }
                        }
                    }

                    if (!objMap.has(key)) {
                        objMap.set(item.id, { ...item });
                    } else {
                        const ex = objMap.get(key);
                        const locTime = Number(item.updatedAt || 0);
                        const remTime = Number(ex.updatedAt || 0);

                        if (remTime > locTime) {
                            objMap.set(key, { ...ex });
                        } else if (locTime > remTime) {
                            objMap.set(key, { ...item });
                        } else {
                            objMap.set(key, {
                                ...item,
                                ...ex
                            });
                        }
                    }
                });

                merged[p] = Array.from(objMap.values());
            });

            return JSON.stringify(merged);
        } catch {
            return localRaw || deserializeValue(remoteRaw);
        }
    }

    function mergeCalisthenicsHistory(localRaw, remoteRaw) {
        try {
            const localArr = Array.isArray(localRaw) ? localRaw : JSON.parse(localRaw || '[]');
            const remoteArr = typeof remoteRaw === 'object' && Array.isArray(remoteRaw) ? remoteRaw : JSON.parse(remoteRaw || '[]');
            const historyMap = new Map();
            remoteArr.forEach(item => {
                const k = item?.id || item?.date || JSON.stringify(item);
                if (k) historyMap.set(k, { ...item });
            });
            localArr.forEach(item => {
                const k = item?.id || item?.date || JSON.stringify(item);
                if (k && !historyMap.has(k)) {
                    historyMap.set(k, { ...item });
                }
            });
            return JSON.stringify(Array.from(historyMap.values()));
        } catch {
            return localRaw || deserializeValue(remoteRaw);
        }
    }

    function mergeActiveSession(localRaw, remoteRaw) {
        try {
            const loc = typeof localRaw === 'object' && localRaw !== null ? localRaw : JSON.parse(localRaw || '{}');
            const rem = typeof remoteRaw === 'object' && remoteRaw !== null ? remoteRaw : JSON.parse(remoteRaw || '{}');
            const locTime = Number(loc.updatedAt || loc.startedAt) || 0;
            const remTime = Number(rem.updatedAt || rem.startedAt) || 0;
            return JSON.stringify(remTime > locTime ? rem : (locTime > 0 ? loc : rem));
        } catch {
            return localRaw || deserializeValue(remoteRaw);
        }
    }

    function mergeDateArray(localRaw, remoteRaw) {
        try {
            const localArr = JSON.parse(localRaw || '[]');
            const remoteArr = typeof remoteRaw === 'object' && Array.isArray(remoteRaw) ? remoteRaw : JSON.parse(remoteRaw || '[]');
            const union = Array.from(new Set([...(Array.isArray(localArr) ? localArr : []), ...(Array.isArray(remoteArr) ? remoteArr : [])]));
            return JSON.stringify(union.sort());
        } catch {
            return localRaw || deserializeValue(remoteRaw);
        }
    }

    function smartMergeKey(key, localVal, remoteVal) {
        if (!localVal) return deserializeValue(remoteVal);
        if (!remoteVal) return localVal;

        if (key === 'dashboard_todos') return mergeTodos(localVal, remoteVal);
        if (key === 'dashboard_habits') return mergeHabits(localVal, remoteVal);
        if (key === 'dashboard_objectives') return mergeObjectives(localVal, remoteVal);
        if (key === 'calisthenics_history_v1') return mergeCalisthenicsHistory(localVal, remoteVal);
        if (key === 'calisthenics_active_session_v1') return mergeActiveSession(localVal, remoteVal);
        if (key === 'productivity_completion_dates' || key === 'nofap_streak_history') return mergeDateArray(localVal, remoteVal);

        // Academy progress / notes: map union
        if (key === 'academy_progress_v1' || key === 'academy_notes_v1') {
            try {
                const localObj = JSON.parse(localVal || '{}');
                const remoteObj = typeof remoteVal === 'object' && remoteVal !== null ? remoteVal : JSON.parse(remoteVal || '{}');
                return JSON.stringify({ ...remoteObj, ...localObj });
            } catch {
                return deserializeValue(remoteVal);
            }
        }

        // Deleted task tombstones: union of records
        if (key === 'dashboard_deleted_tasks' || key === 'dashboard_deleted_habits') {
            try {
                const locObj = typeof localVal === 'object' && localVal !== null ? localVal : JSON.parse(localVal || '{}');
                const remObj = typeof remoteVal === 'object' && remoteVal !== null ? remoteVal : JSON.parse(remoteVal || '{}');
                return JSON.stringify({ ...remObj, ...locObj });
            } catch {
                return deserializeValue(remoteVal);
            }
        }

        // Objective tombstones are a map of objective ID -> deletion time.
        if (key === 'dashboard_deleted_objectives') {
            try {
                const locObj = typeof localVal === 'object' && localVal !== null ? localVal : JSON.parse(localVal || '{}');
                const remObj = typeof remoteVal === 'object' && remoteVal !== null ? remoteVal : JSON.parse(remoteVal || '{}');
                return JSON.stringify({ ...remObj, ...locObj });
            } catch {
                return deserializeValue(remoteVal);
            }
        }

        // NoFap start date: if remote is valid number, take newer/active
        if (key === 'nofap_start_date') {
            const numRem = Number(remoteVal) || 0;
            const numLoc = Number(localVal) || 0;
            return String(numRem > 0 ? numRem : numLoc);
        }

        return deserializeValue(remoteVal);
    }

    // =========================================================================
    // 2. Multi-Tab BroadcastChannel Bridge (Instant same-browser sync)
    // =========================================================================

    function initBroadcastChannel() {
        if (typeof BroadcastChannel === 'undefined' || broadcastChannel) return;

        try {
            broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
            broadcastChannel.onmessage = (event) => {
                const data = event.data;
                if (!data || data.senderId === TAB_ID) return;

                if (data.type === 'KEY_CHANGE' && TRACKED_KEYS.includes(data.key)) {
                    isApplyingRemote = true;
                    try {
                        localStorage.setItem(data.key, data.value);
                        setLocalTimestamp(data.key, data.timestamp);
                    } finally {
                        isApplyingRemote = false;
                    }
                    window.dispatchEvent(new CustomEvent('workspace-synced', { detail: { appliedCount: 1, key: data.key, source: 'tab_broadcast' } }));
                    window.dispatchEvent(new StorageEvent('storage', {
                        key: data.key,
                        newValue: typeof data.value === 'string' ? data.value : JSON.stringify(data.value)
                    }));
                }
            };
        } catch (_) {}
    }

    function broadcastLocalChange(key, value) {
        if (!broadcastChannel) return;
        try {
            broadcastChannel.postMessage({
                type: 'KEY_CHANGE',
                key,
                value,
                timestamp: new Date().toISOString(),
                senderId: TAB_ID
            });
        } catch (_) {}
    }

    // =========================================================================
    // 3. Supabase Realtime WebSocket Client (Phoenix Protocol)
    // =========================================================================

    function initRealtimeWebSocket() {
        if (typeof WebSocket === 'undefined' || !isOnline()) return;
        if (realtimeSocket && (realtimeSocket.readyState === WebSocket.OPEN || realtimeSocket.readyState === WebSocket.CONNECTING)) return;

        try {
            const wsUrl = config.url.replace(/^http/, 'ws') + `/realtime/v1/websocket?apikey=${encodeURIComponent(config.key)}&vsn=1.0.0`;
            realtimeSocket = new WebSocket(wsUrl);

            realtimeSocket.onopen = () => {
                setRealtimeStatus(true);
                // Join channel for public.workspace_state
                const joinMsg = {
                    topic: `realtime:public:${config.tableName}`,
                    event: 'phx_join',
                    payload: {
                        config: {
                            postgres_changes: [
                                { event: '*', schema: 'public', table: config.tableName }
                            ]
                        }
                    },
                    ref: String(phoenixMessageRef++)
                };
                realtimeSocket.send(JSON.stringify(joinMsg));

                // Send heartbeat every 25 seconds
                if (realtimeHeartbeatInterval) clearInterval(realtimeHeartbeatInterval);
                realtimeHeartbeatInterval = setInterval(() => {
                    if (realtimeSocket && realtimeSocket.readyState === WebSocket.OPEN) {
                        realtimeSocket.send(JSON.stringify({
                            topic: 'phoenix',
                            event: 'heartbeat',
                            payload: {},
                            ref: String(phoenixMessageRef++)
                        }));
                    }
                }, 25000);
            };

            realtimeSocket.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    if (msg.event === 'postgres_changes') {
                        const changeData = msg.payload?.data;
                        const record = changeData?.record;
                        if (record && record.key) {
                            handleRemoteLiveRecord(record);
                        }
                    }
                } catch (_) {}
            };

            realtimeSocket.onclose = () => {
                setRealtimeStatus(false);
                if (realtimeHeartbeatInterval) clearInterval(realtimeHeartbeatInterval);
                // Reconnect after 6 seconds if online
                if (isOnline()) {
                    if (realtimeReconnectTimeout) clearTimeout(realtimeReconnectTimeout);
                    realtimeReconnectTimeout = setTimeout(initRealtimeWebSocket, 6000);
                }
            };

            realtimeSocket.onerror = () => {
                setRealtimeStatus(false);
            };
        } catch (_) {
            setRealtimeStatus(false);
        }
    }

    function handleRemoteLiveRecord(record) {
        if (!record || !record.key || record.key.startsWith('snapshot:')) return;
        if (!TRACKED_KEYS.includes(record.key)) return;

        const currentLocal = localStorage.getItem(record.key);
        const merged = smartMergeKey(record.key, currentLocal, record.value);

        if (merged !== currentLocal) {
            isApplyingRemote = true;
            try {
                localStorage.setItem(record.key, merged);
                setLocalTimestamp(record.key, record.updated_at || new Date().toISOString());
            } finally {
                isApplyingRemote = false;
            }

            broadcastLocalChange(record.key, merged);
            setStatus('synced', 'Live update received from cloud');

            window.dispatchEvent(new CustomEvent('workspace-synced', { detail: { key: record.key, source: 'realtime' } }));
            window.dispatchEvent(new StorageEvent('storage', {
                key: record.key,
                newValue: typeof merged === 'string' ? merged : JSON.stringify(merged)
            }));
        }
    }

    // =========================================================================
    // 4. REST Database Operations & Two-Way Sync
    // =========================================================================

    async function checkTableExists() {
        if (!isOnline()) {
            setStatus('offline', 'Network is offline');
            return false;
        }
        setStatus('checking', 'Verifying Supabase connection...');
        try {
            const res = await fetch(`${config.url}/rest/v1/${config.tableName}?select=key&limit=1`, {
                headers: buildHeaders()
            });

            if (res.status === 404 || res.status === 400) {
                const body = await res.text();
                if (body.includes('schema cache') || body.includes('PGRST205') || body.includes('Could not find the table')) {
                    setStatus('needs_setup', 'Table public.workspace_state needs to be created in Supabase SQL editor');
                    return false;
                }
            }

            if (!res.ok) {
                const errText = await res.text();
                setStatus('error', `HTTP ${res.status}: ${errText.slice(0, 80)}`);
                return false;
            }

            return true;
        } catch (err) {
            if (!isOnline()) {
                setStatus('offline', 'Network is offline');
            } else {
                setStatus('error', err.message);
            }
            return false;
        }
    }

    async function upsertKeysToCloud(entries) {
        if (!entries || entries.length === 0) return { success: true };
        if (!isOnline()) {
            queuePendingOffline(entries);
            setStatus('offline', 'Queued for sync when online');
            requestServiceWorkerSync();
            return { success: false, reason: 'offline' };
        }

        const exists = await checkTableExists();
        if (!exists) return { success: false, reason: 'table_missing' };

        setStatus('syncing', `Uploading ${entries.length} items to cloud...`);

        const nowIso = new Date().toISOString();
        const payload = entries.map(({ key, value }) => ({
            key,
            value: serializeValue(value),
            updated_at: nowIso
        }));

        try {
            const res = await fetch(`${config.url}/rest/v1/${config.tableName}`, {
                method: 'POST',
                headers: {
                    ...buildHeaders(),
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const error = await res.text();
                setStatus('error', `Upload failed: ${error.slice(0, 100)}`);
                return { success: false, error };
            }

            entries.forEach(({ key }) => setLocalTimestamp(key, nowIso));
            localStorage.setItem(STORAGE_LAST_SYNC_KEY, nowIso);
            setStatus('synced', `Synced ${entries.length} items`);
            return { success: true };
        } catch (err) {
            setStatus('error', err.message);
            return { success: false, error: err.message };
        }
    }

    function queuePendingOffline(entries) {
        try {
            const queue = JSON.parse(localStorage.getItem(STORAGE_SYNC_QUEUE_KEY) || '[]');
            const map = new Map(queue.map(q => [q.key, q.value]));
            entries.forEach(({ key, value }) => map.set(key, value));
            const newQueue = Array.from(map.entries()).map(([key, value]) => ({ key, value }));
            localStorage.setItem(STORAGE_SYNC_QUEUE_KEY, JSON.stringify(newQueue));
        } catch (_) {}
    }

    async function flushOfflineQueue() {
        try {
            const queueRaw = localStorage.getItem(STORAGE_SYNC_QUEUE_KEY);
            if (!queueRaw) return;
            const queue = JSON.parse(queueRaw);
            if (!Array.isArray(queue) || queue.length === 0) return;

            const res = await upsertKeysToCloud(queue);
            if (res.success) {
                localStorage.removeItem(STORAGE_SYNC_QUEUE_KEY);
            }
        } catch (_) {}
    }

    function requestServiceWorkerSync() {
        try {
            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                navigator.serviceWorker.ready.then(reg => {
                    return reg.sync.register('supabase-sync-queue');
                }).catch(() => {});
            }
        } catch (_) {}
    }

    async function fetchAllFromCloud() {
        if (!isOnline()) {
            setStatus('offline', 'Network is offline');
            return null;
        }

        const exists = await checkTableExists();
        if (!exists) return null;

        setStatus('syncing', 'Downloading data from Supabase...');
        try {
            const res = await fetch(`${config.url}/rest/v1/${config.tableName}?select=*`, {
                headers: buildHeaders()
            });

            if (!res.ok) {
                const error = await res.text();
                setStatus('error', `Download failed: ${error.slice(0, 100)}`);
                return null;
            }

            const data = await res.json();
            return Array.isArray(data) ? data.filter(d => !d.key.startsWith('snapshot:')) : [];
        } catch (err) {
            setStatus('error', err.message);
            return null;
        }
    }

    async function syncNow() {
        if (!isOnline()) {
            setStatus('offline', 'Cannot sync while offline');
            return { success: false, reason: 'offline' };
        }

        const tableOk = await checkTableExists();
        if (!tableOk) {
            return { success: false, reason: 'needs_setup' };
        }

        // Flush any locally pending debounce pushes immediately so remote fetch merges the freshest state
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
        if (pendingPushMap.size > 0) {
            const pendingEntries = Array.from(pendingPushMap.entries()).map(([k, v]) => ({ key: k, value: v }));
            pendingPushMap.clear();
            await upsertKeysToCloud(pendingEntries);
        }

        setStatus('syncing', 'Synchronizing with Supabase...');
        const remoteData = await fetchAllFromCloud();
        if (remoteData === null) {
            return { success: false, reason: 'fetch_failed' };
        }

        const localStamps = getLocalTimestamps();
        const remoteMap = new Map(remoteData.map(r => [r.key, r]));
        let appliedFromRemote = 0;
        let needPushToRemote = [];

        isApplyingRemote = true;
        try {
            // First run on empty database: seed from local
            if (remoteData.length === 0) {
                const toSeed = [];
                TRACKED_KEYS.forEach(key => {
                    const localVal = localStorage.getItem(key);
                    if (localVal !== null) toSeed.push({ key, value: localVal });
                });
                if (toSeed.length > 0) {
                    await upsertKeysToCloud(toSeed);
                }
                setStatus('synced', `Initialized cloud database with ${toSeed.length} local items`);
                initRealtimeWebSocket();
                return { success: true, seeded: toSeed.length };
            }

            // Two-way smart merge
            TRACKED_KEYS.forEach(key => {
                const localVal = localStorage.getItem(key);
                const remoteItem = remoteMap.get(key);

                if (remoteItem) {
                    const mergedVal = smartMergeKey(key, localVal, remoteItem.value);
                    const remoteSerialized = serializeValue(remoteItem.value);

                    if (localVal === null || mergedVal !== localVal) {
                        localStorage.setItem(key, mergedVal);
                        setLocalTimestamp(key, remoteItem.updated_at || new Date().toISOString());
                        appliedFromRemote++;
                    }

                    if (mergedVal !== remoteSerialized) {
                        needPushToRemote.push({ key, value: mergedVal });
                    }
                } else if (localVal !== null) {
                    needPushToRemote.push({ key, value: localVal });
                }
            });
        } finally {
            isApplyingRemote = false;
        }

        if (needPushToRemote.length > 0) {
            await upsertKeysToCloud(needPushToRemote);
        }

        await flushOfflineQueue();

        const nowIso = new Date().toISOString();
        localStorage.setItem(STORAGE_LAST_SYNC_KEY, nowIso);
        setStatus('synced', `Synced: ${appliedFromRemote} updated locally, ${needPushToRemote.length} uploaded`);

        initRealtimeWebSocket();

        window.dispatchEvent(new CustomEvent('workspace-synced', { detail: { appliedCount: appliedFromRemote, pushedCount: needPushToRemote.length } }));
        window.dispatchEvent(new StorageEvent('storage', { key: 'dashboard_todos', newValue: localStorage.getItem('dashboard_todos') }));
        window.dispatchEvent(new StorageEvent('storage', { key: 'dashboard_habits', newValue: localStorage.getItem('dashboard_habits') }));

        return { success: true, updatedLocally: appliedFromRemote, pushed: needPushToRemote.length };
    }

    async function pushAll() {
        const items = [];
        TRACKED_KEYS.forEach(key => {
            const val = localStorage.getItem(key);
            if (val !== null) items.push({ key, value: val });
        });
        if (items.length === 0) return { success: true, count: 0 };
        const res = await upsertKeysToCloud(items);
        if (res.success) {
            setStatus('synced', `Pushed ${items.length} items to Supabase`);
        }
        return res;
    }

    async function pullAll() {
        const remoteData = await fetchAllFromCloud();
        if (!remoteData) return { success: false };

        isApplyingRemote = true;
        let count = 0;
        try {
            remoteData.forEach(r => {
                localStorage.setItem(r.key, deserializeValue(r.value));
                setLocalTimestamp(r.key, r.updated_at);
                count++;
            });
        } finally {
            isApplyingRemote = false;
        }

        const nowIso = new Date().toISOString();
        localStorage.setItem(STORAGE_LAST_SYNC_KEY, nowIso);
        setStatus('synced', `Pulled ${count} items from Supabase`);

        window.dispatchEvent(new CustomEvent('workspace-synced', { detail: { appliedCount: count } }));
        window.dispatchEvent(new StorageEvent('storage', { key: 'dashboard_todos', newValue: localStorage.getItem('dashboard_todos') }));
        window.dispatchEvent(new StorageEvent('storage', { key: 'dashboard_habits', newValue: localStorage.getItem('dashboard_habits') }));
        return { success: true, count };
    }

    // =========================================================================
    // 5. Cloud Time Machine Snapshots
    // =========================================================================

    async function createCloudSnapshot(userLabel) {
        if (!isOnline()) return { success: false, error: 'Offline' };
        const exists = await checkTableExists();
        if (!exists) return { success: false, error: 'Table setup required' };

        const snapshot = {
            label: userLabel ? userLabel.trim().slice(0, 60) : 'Snapshot',
            createdAt: new Date().toISOString(),
            data: {}
        };

        TRACKED_KEYS.forEach(k => {
            const val = localStorage.getItem(k);
            if (val !== null) snapshot.data[k] = val;
        });

        const snapshotKey = `snapshot:${Date.now()}:${encodeURIComponent(snapshot.label)}`;
        const payload = [{
            key: snapshotKey,
            value: snapshot,
            updated_at: snapshot.createdAt
        }];

        try {
            const res = await fetch(`${config.url}/rest/v1/${config.tableName}`, {
                method: 'POST',
                headers: {
                    ...buildHeaders(),
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error(await res.text());
            return { success: true, snapshotKey, createdAt: snapshot.createdAt };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    async function listCloudSnapshots() {
        if (!isOnline()) return [];
        const exists = await checkTableExists();
        if (!exists) return [];

        try {
            const res = await fetch(`${config.url}/rest/v1/${config.tableName}?key=like.snapshot:*&select=key,updated_at&order=updated_at.desc&limit=15`, {
                headers: buildHeaders()
            });
            if (!res.ok) return [];
            const rows = await res.json();
            return rows.map(r => {
                const parts = r.key.split(':');
                const label = parts[2] ? decodeURIComponent(parts[2]) : 'Snapshot';
                return {
                    key: r.key,
                    timestamp: r.updated_at,
                    label
                };
            });
        } catch {
            return [];
        }
    }

    async function restoreCloudSnapshot(snapshotKey) {
        if (!isOnline()) return { success: false, error: 'Offline' };
        try {
            const res = await fetch(`${config.url}/rest/v1/${config.tableName}?key=eq.${encodeURIComponent(snapshotKey)}&select=*`, {
                headers: buildHeaders()
            });
            if (!res.ok) throw new Error('Failed to download snapshot');
            const rows = await res.json();
            if (!rows.length) throw new Error('Snapshot not found');

            const snapshot = rows[0].value;
            if (!snapshot || !snapshot.data) throw new Error('Malformed snapshot payload');

            isApplyingRemote = true;
            let count = 0;
            try {
                for (const [k, v] of Object.entries(snapshot.data)) {
                    if (TRACKED_KEYS.includes(k) && typeof v === 'string') {
                        localStorage.setItem(k, v);
                        setLocalTimestamp(k, snapshot.createdAt);
                        count++;
                    }
                }
            } finally {
                isApplyingRemote = false;
            }

            window.dispatchEvent(new CustomEvent('workspace-synced', { detail: { appliedCount: count, source: 'snapshot_restore' } }));
            return { success: true, restoredCount: count };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    // =========================================================================
    // 6. Mobile Device Pairing Helper
    // =========================================================================

    function getPairingUrl() {
        if (typeof window === 'undefined') return '';
        const base = window.location.origin + window.location.pathname;
        const params = new URLSearchParams({
            sb_url: config.url,
            sb_key: config.key
        });
        return `${base}?${params.toString()}`;
    }

    function getPairingQrImageUrl() {
        const pairingUrl = getPairingUrl();
        return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pairingUrl)}&bgcolor=14-1e-33&color=38-bd-f8`;
    }

    // =========================================================================
    // 7. LocalStorage Interceptor & Lifecycle
    // =========================================================================

    function schedulePush(key, value) {
        if (isApplyingRemote) return;
        if (!TRACKED_KEYS.includes(key)) return;

        setLocalTimestamp(key);
        broadcastLocalChange(key, value);
        pendingPushMap.set(key, value);

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            if (pendingPushMap.size === 0) return;
            const entries = Array.from(pendingPushMap.entries()).map(([k, v]) => ({ key: k, value: v }));
            pendingPushMap.clear();
            await upsertKeysToCloud(entries);
        }, 1000);
    }

    function hookLocalStorage() {
        if (typeof Storage === 'undefined') return;
        const origSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key, value) {
            origSetItem.apply(this, arguments);
            if (this === localStorage) {
                schedulePush(key, value);
            }
        };
    }

    async function init() {
        if (isInitialized) return;
        isInitialized = true;

        hookLocalStorage();
        initBroadcastChannel();

        window.addEventListener('online', () => {
            setStatus('checking', 'Network restored. Synchronizing...');
            flushOfflineQueue();
            syncNow();
            initRealtimeWebSocket();
        });

        window.addEventListener('offline', () => {
            setStatus('offline', 'Network is offline. Local changes saved.');
            setRealtimeStatus(false);
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && isOnline()) {
                syncNow();
                initRealtimeWebSocket();
            }
        });

        setTimeout(() => {
            if (isOnline()) {
                syncNow();
            } else {
                setStatus('offline', 'Network is offline');
            }
        }, 150);

        // Continuous background synchronization every 8s for live multi-device parity
        setInterval(() => {
            if (isOnline() && syncStatus !== 'syncing') {
                syncNow();
            }
        }, 8000);
    }

    async function copySqlSetup() {
        try {
            await navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
            return true;
        } catch (_) {
            const ta = document.createElement('textarea');
            ta.value = SQL_SETUP_SCRIPT;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            return true;
        }
    }

    return {
        init,
        syncNow,
        pushAll,
        pullAll,
        schedulePush,
        checkTableExists,
        copySqlSetup,
        createCloudSnapshot,
        listCloudSnapshots,
        restoreCloudSnapshot,
        getPairingUrl,
        getPairingQrImageUrl,
        getSqlSetupScript: () => SQL_SETUP_SCRIPT,
        getConfig: () => ({ ...config }),
        getStatus: () => ({ status: syncStatus, message: statusMessage, realtimeConnected }),
        saveCustomConfig: (newCfg) => {
            config = { ...config, ...newCfg };
            localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
            checkTableExists();
            initRealtimeWebSocket();
        },
        resetDefaultConfig: () => {
            config = { ...DEFAULT_CONFIG };
            localStorage.removeItem(STORAGE_CONFIG_KEY);
            checkTableExists();
            initRealtimeWebSocket();
        }
    };
}));
