// ==========================================================================
// Academy & Roadmaps Hub — High Performance Interactive Engine
// Instant 0ms Toggling, Direct DOM Updates & O(1) State Indexing
// ==========================================================================

(function() {
    'use strict';

    // State & Storage Keys
    const STORAGE_KEY_PROGRESS = 'academy_progress_v1';
    const STORAGE_KEY_NOTES = 'academy_notes_v1';
    const STORAGE_KEY_TRACK = 'academy_active_track';
    const STORAGE_KEY_THEME = 'theme';

    const curriculum = window.CURRICULUM_DATA ? window.CURRICULUM_DATA.tracks : {};
    let activeTrackId = localStorage.getItem(STORAGE_KEY_TRACK) || 'cyber';
    let activeLevelId = 'all';
    let activeFilter = 'all'; // 'all', 'remaining', 'completed'
    let searchQuery = '';
    let currentNoteItemId = null;

    // Fast Inlined SVGs (prevents heavy Lucide DOM scans across 4,500+ items)
    const SVG_NOTE = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v5h5"/></svg>`;
    const SVG_CALENDAR = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M10 16h4"/><path d="M12 14v4"/></svg>`;
    const SVG_CHEVRON = `<svg class="module-caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

    // Fast Maps & In-Memory Indexes
    let progressMap = {};
    try {
        progressMap = JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS)) || {};
    } catch {
        progressMap = {};
    }

    let notesMap = {};
    try {
        notesMap = JSON.parse(localStorage.getItem(STORAGE_KEY_NOTES)) || {};
    } catch {
        notesMap = {};
    }

    // O(1) Index: itemId -> { item, mod, lvl, trackId }
    const itemIndex = {};
    // O(1) Level Stats: lvlId -> { total, completed }
    const levelStats = {};
    // O(1) Track Stats: trackId -> { total, completed }
    const trackStats = {};

    function buildFastIndexes() {
        Object.keys(curriculum).forEach(trackId => {
            const track = curriculum[trackId];
            trackStats[trackId] = { total: 0, completed: 0 };

            (track.levels || []).forEach(lvl => {
                levelStats[lvl.id] = { total: 0, completed: 0 };

                (lvl.modules || []).forEach(mod => {
                    (mod.items || []).forEach(item => {
                        if (!item.isHeading) {
                            // Default completion from docx
                            if (progressMap[item.id] === undefined && item.checked) {
                                progressMap[item.id] = true;
                            }

                            const isDone = !!progressMap[item.id];
                            trackStats[trackId].total++;
                            levelStats[lvl.id].total++;
                            if (isDone) {
                                trackStats[trackId].completed++;
                                levelStats[lvl.id].completed++;
                            }

                            itemIndex[item.id] = {
                                item,
                                mod,
                                lvl,
                                trackId
                            };
                        }
                    });
                });
            });
        });

        // Persist initial defaults once
        try {
            localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progressMap));
        } catch (_) {}
    }

    function saveProgressImmediate() {
        try {
            localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progressMap));
        } catch (_) {}
    }

    function saveNotesData() {
        try {
            localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesMap));
        } catch (_) {}
    }

    function localDateKey(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function escapeHtml(text) {
        if (!text) return '';
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    // Toast notification
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            <span>${escapeHtml(message)}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 250);
        }, 2800);
    }

    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    // Theme Management
    function initTheme() {
        const stored = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
        document.documentElement.setAttribute('data-theme', stored);
        const toggleBtn = document.getElementById('themeToggleBtn');
        if (toggleBtn) {
            toggleBtn.onclick = () => {
                const current = document.documentElement.getAttribute('data-theme') || 'dark';
                const next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem(STORAGE_KEY_THEME, next);
                refreshIcons();
            };
        }
    }

    function updateTrackThemeColor(color) {
        document.documentElement.style.setProperty('--accent', color);
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        document.documentElement.style.setProperty('--accent-bg', `rgba(${r}, ${g}, ${b}, 0.12)`);
    }

    // Switch Track
    function selectTrack(trackId) {
        if (!curriculum[trackId]) return;
        activeTrackId = trackId;
        localStorage.setItem(STORAGE_KEY_TRACK, trackId);
        activeLevelId = 'all';

        // Update nav tabs
        document.querySelectorAll('.track-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-track') === trackId);
        });

        const track = curriculum[trackId];
        updateTrackThemeColor(track.color || '#06b6d4');

        renderTrackHero();
        renderLevelPills();
        renderNextUpBanner();
        renderModules();
    }

    // Fit Vector Emblems for Hero Titles
    function getTrackHeroEmblem(trackId) {
        if (trackId === 'cyber') {
            return `
                <div class="hero-emblem cyber">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="m9 12 2 2 4-4"/>
                    </svg>
                </div>
            `;
        }
        if (trackId === 'french') {
            return `
                <div class="hero-emblem french">
                    <svg width="28" height="28" viewBox="0 0 32 32" style="border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.35); flex-shrink: 0;">
                        <clipPath id="heroFrRound"><circle cx="16" cy="16" r="16"/></clipPath>
                        <g clip-path="url(#heroFrRound)">
                            <rect x="0" y="0" width="10.67" height="32" fill="#0055A4"/>
                            <rect x="10.67" y="0" width="10.67" height="32" fill="#FFFFFF"/>
                            <rect x="21.33" y="0" width="10.67" height="32" fill="#EF4135"/>
                        </g>
                    </svg>
                </div>
            `;
        }
        if (trackId === 'german') {
            return `
                <div class="hero-emblem german">
                    <svg width="28" height="28" viewBox="0 0 32 32" style="border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.35); flex-shrink: 0;">
                        <clipPath id="heroDeRound"><circle cx="16" cy="16" r="16"/></clipPath>
                        <g clip-path="url(#heroDeRound)">
                            <rect x="0" y="0" width="32" height="10.67" fill="#111111"/>
                            <rect x="0" y="10.67" width="32" height="10.67" fill="#DD0000"/>
                            <rect x="0" y="21.33" width="32" height="10.67" fill="#FFCE00"/>
                        </g>
                    </svg>
                </div>
            `;
        }
        return '';
    }

    // Fit Vector Icons for Module Headers
    function getModuleIconSvg(title, trackId) {
        const t = (title || '').toLowerCase();
        
        if (trackId === 'cyber') {
            if (t.includes('réseau') || t.includes('outils réseau') || t.includes('lan') || t.includes('osi')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="4" rx="2"/><line x1="2" x2="22" y1="20" y2="20"/><line x1="12" x2="12" y1="16" y2="20"/></svg>`;
            }
            if (t.includes('système') || t.includes('linux') || t.includes('windows') || t.includes('bash') || t.includes('powershell')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`;
            }
            if (t.includes('donnée') || t.includes('base') || t.includes('sql')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`;
            }
            if (t.includes('cloud') || t.includes('container') || t.includes('docker') || t.includes('microservices')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
            }
            if (t.includes('sécurité') || t.includes('hacking') || t.includes('audit') || t.includes('malware') || t.includes('cryptologie') || t.includes('intrusion')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="1"/><path d="M12 12v2.5"/></svg>`;
            }
            if (t.includes('pratique') || t.includes('projet') || t.includes('lab')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`;
            }
            return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
        }

        if (trackId === 'french') {
            if (t.includes('conjugaison') || t.includes('temps') || t.includes('verbe')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>`;
            }
            if (t.includes('grammaire') || t.includes('phrase') || t.includes('accord') || t.includes('syntaxe')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="m9 10 2 2 4-4"/></svg>`;
            }
            if (t.includes('vocabulaire') || t.includes('lexique') || t.includes('thématique')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`;
            }
            if (t.includes('orale') || t.includes('prononciation') || t.includes('écoute') || t.includes('communication')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>`;
            }
            if (t.includes('écrite') || t.includes('texte') || t.includes('synthèse')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
            }
            if (t.includes('validation') || t.includes('dalf') || t.includes('examen')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`;
            }
            return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
        }

        if (trackId === 'german') {
            if (t.includes('grammatik') || t.includes('fälle') || t.includes('satzbau') || t.includes('passiv') || t.includes('konjunktiv') || t.includes('deklination')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="m9 10 2 2 4-4"/></svg>`;
            }
            if (t.includes('wortschatz') || t.includes('redemittel') || t.includes('wortbildung')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`;
            }
            if (t.includes('sprechen') || t.includes('aussprache') || t.includes('hörverstehen') || t.includes('kommunikativ')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
            }
            if (t.includes('schreiben') || t.includes('leseverstehen') || t.includes('text')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`;
            }
            if (t.includes('prüfung') || t.includes('endkontrolle') || t.includes('goethe') || t.includes('zertifikat')) {
                return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`;
            }
            return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
        }

        return `<svg class="module-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }

    // Render Track Hero Card (Once on track switch)
    function renderTrackHero() {
        const track = curriculum[activeTrackId];
        if (!track) return;

        const stats = trackStats[activeTrackId] || { total: 0, completed: 0 };
        const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

        const heroWrap = document.getElementById('trackHeroContainer');
        if (!heroWrap) return;

        heroWrap.innerHTML = `
            <div class="track-hero-card">
                <div class="track-hero-top">
                    <div class="hero-title-row">
                        ${getTrackHeroEmblem(activeTrackId)}
                        <div class="hero-title-text">
                            <h1>${escapeHtml(track.title)}</h1>
                            <p>${escapeHtml(track.subtitle)}</p>
                        </div>
                    </div>
                    <div class="track-stat-pill">
                        <span class="stat-pct" id="heroStatPct">${percent}%</span>
                        <span class="stat-count" id="heroStatCount">${stats.completed} / ${stats.total} topics mastered</span>
                    </div>
                </div>
                <div class="track-progress-bar-wrap" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
                    <div class="track-progress-bar-fill" id="heroProgressBarFill" style="width: ${percent}%;"></div>
                </div>
            </div>
        `;
    }

    // Update Hero Stats (0ms direct text mutation, NO innerHTML, NO Lucide scan)
    function updateHeroStatsDOM() {
        const stats = trackStats[activeTrackId] || { total: 0, completed: 0 };
        const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

        const pctEl = document.getElementById('heroStatPct');
        const countEl = document.getElementById('heroStatCount');
        const fillEl = document.getElementById('heroProgressBarFill');

        if (pctEl) pctEl.textContent = `${percent}%`;
        if (countEl) countEl.textContent = `${stats.completed} / ${stats.total} topics mastered`;
        if (fillEl) fillEl.style.width = `${percent}%`;
    }

    // Find Next Uncompleted Item
    function getNextUncompletedItem(trackId) {
        const track = curriculum[trackId];
        if (!track) return null;

        for (const lvl of (track.levels || [])) {
            for (const mod of (lvl.modules || [])) {
                for (const item of (mod.items || [])) {
                    if (!item.isHeading && !progressMap[item.id]) {
                        return {
                            item,
                            moduleTitle: mod.title,
                            levelTitle: lvl.shortTitle || lvl.title
                        };
                    }
                }
            }
        }
        return null;
    }

    // Render Next Up Banner (Created once on track switch)
    function renderNextUpBanner() {
        const container = document.getElementById('nextUpContainer');
        if (!container) return;

        const next = getNextUncompletedItem(activeTrackId);
        if (!next) {
            container.innerHTML = `
                <div class="next-up-banner" style="background: var(--success-bg); border-color: rgba(16, 185, 129, 0.3);">
                    <div class="next-up-left">
                        <div class="next-up-icon" style="background: var(--success);">
                            <i data-lucide="award" style="width: 18px; height: 18px;"></i>
                        </div>
                        <div class="next-up-text">
                            <span class="next-up-label" style="color: var(--success);">Curriculum Complete!</span>
                            <div class="next-up-title">All objectives in this track have been mastered. Outstanding work!</div>
                        </div>
                    </div>
                </div>
            `;
            refreshIcons();
            return;
        }

        container.innerHTML = `
            <div class="next-up-banner">
                <div class="next-up-left">
                    <div class="next-up-icon">
                        <i data-lucide="sparkles" style="width: 18px; height: 18px;"></i>
                    </div>
                    <div class="next-up-text">
                        <span class="next-up-label" id="nextUpLabel">Next Up in ${escapeHtml(next.levelTitle)}</span>
                        <div class="next-up-title" id="nextUpTitle" title="${escapeHtml(next.item.text)}">${escapeHtml(next.item.text)}</div>
                    </div>
                </div>
                <button type="button" class="btn-add-today-sm" id="btnNextUpAddToday" title="Send this objective to Today's Tasks">
                    <i data-lucide="plus-circle" style="width: 14px; height: 14px;"></i>
                    <span>Add to Today</span>
                </button>
            </div>
        `;

        document.getElementById('btnNextUpAddToday').onclick = () => {
            const currNext = getNextUncompletedItem(activeTrackId);
            if (currNext) {
                const track = curriculum[activeTrackId];
                sendItemToToday(currNext.item.text, track ? track.category : 'lang');
            }
        };

        refreshIcons();
    }

    // Fast update of Next Up Banner without innerHTML
    function updateNextUpDOM() {
        const next = getNextUncompletedItem(activeTrackId);
        const labelEl = document.getElementById('nextUpLabel');
        const titleEl = document.getElementById('nextUpTitle');

        if (!next) {
            renderNextUpBanner(); // Re-render once to show completed trophy
            return;
        }

        if (labelEl) labelEl.textContent = `Next Up in ${next.levelTitle}`;
        if (titleEl) {
            titleEl.textContent = next.item.text;
            titleEl.title = next.item.text;
        }
    }

    // Render Level Filter Pills (Created once on track switch)
    function renderLevelPills() {
        const container = document.getElementById('levelPillsContainer');
        if (!container) return;

        const track = curriculum[activeTrackId];
        if (!track) return;

        let pillsHtml = `
            <button type="button" class="level-pill-btn ${activeLevelId === 'all' ? 'active' : ''}" data-lvl="all">
                All Levels (${track.levels.length})
            </button>
        `;

        (track.levels || []).forEach(lvl => {
            const stats = levelStats[lvl.id] || { total: 0, completed: 0 };
            const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
            const isAct = activeLevelId === lvl.id ? 'active' : '';
            pillsHtml += `
                <button type="button" class="level-pill-btn ${isAct}" data-lvl="${lvl.id}" id="pill_${lvl.id}">
                    <span>${escapeHtml(lvl.shortTitle || lvl.title)}</span>
                    <span class="lvl-pct-tag" style="font-size: 0.72rem; opacity: 0.8;">(${pct}%)</span>
                </button>
            `;
        });

        container.innerHTML = pillsHtml;

        container.querySelectorAll('.level-pill-btn').forEach(btn => {
            btn.onclick = () => {
                activeLevelId = btn.getAttribute('data-lvl');
                container.querySelectorAll('.level-pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderModules();
            };
        });
    }

    // Fast update of level pill percentage
    function updateLevelPillDOM(lvlId) {
        const pill = document.getElementById(`pill_${lvlId}`);
        if (!pill) return;
        const stats = levelStats[lvlId] || { total: 0, completed: 0 };
        const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        const tag = pill.querySelector('.lvl-pct-tag');
        if (tag) tag.textContent = `(${pct}%)`;
    }

    // Filter Logic
    function filterItem(item) {
        if (item.isHeading) return true;
        const isDone = !!progressMap[item.id];

        if (activeFilter === 'remaining' && isDone) return false;
        if (activeFilter === 'completed' && !isDone) return false;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const textMatch = (item.text || '').toLowerCase().includes(q);
            const detailsMatch = (item.details || []).some(d => d.toLowerCase().includes(q));
            return textMatch || detailsMatch;
        }

        return true;
    }

    // Render Modules (Uses inline SVGs — zero Lucide overhead for 2,200 items!)
    function renderModules() {
        const container = document.getElementById('modulesContainer');
        if (!container) return;

        const track = curriculum[activeTrackId];
        if (!track) return;

        let levelsToRender = track.levels || [];
        if (activeLevelId !== 'all') {
            levelsToRender = levelsToRender.filter(l => l.id === activeLevelId);
        }

        let totalRenderedModules = 0;
        const htmlChunks = [];

        levelsToRender.forEach(lvl => {
            (lvl.modules || []).forEach(mod => {
                const visibleItems = (mod.items || []).filter(filterItem);

                if (searchQuery && visibleItems.length === 0) return;

                totalRenderedModules++;

                // Fast count for this module
                const actionableItems = (mod.items || []).filter(i => !i.isHeading);
                const modTotal = actionableItems.length;
                let modCompleted = 0;
                for (let i = 0; i < modTotal; i++) {
                    if (progressMap[actionableItems[i].id]) modCompleted++;
                }
                const isModComplete = modTotal > 0 && modCompleted === modTotal;

                htmlChunks.push(`
                    <div class="module-card ${searchQuery ? 'expanded' : ''}" data-mod-id="${mod.id}">
                        <div class="module-header" onclick="window.academyToggleModule('${mod.id}')">
                            <div class="module-title-wrap">
                                ${getModuleIconSvg(mod.title, activeTrackId)}
                                <span class="module-title">${escapeHtml(mod.title)}</span>
                                <span class="module-progress-badge ${isModComplete ? 'completed' : ''}" id="badge_${mod.id}">
                                    ${modCompleted}/${modTotal} done
                                </span>
                            </div>
                            ${SVG_CHEVRON}
                        </div>
                        <div class="module-items-list">
                `);

                if (visibleItems.length === 0) {
                    htmlChunks.push(`<div style="padding: 10px 0; color: var(--text-muted); font-size: 0.85rem;">No items matching current filter.</div>`);
                } else {
                    visibleItems.forEach(item => {
                        if (item.isHeading) {
                            htmlChunks.push(`<div class="topic-subheading">${escapeHtml(item.text)}</div>`);
                            return;
                        }

                        const isDone = !!progressMap[item.id];
                        const hasNote = !!notesMap[item.id];

                        htmlChunks.push(`
                            <div class="topic-item-row ${isDone ? 'is-done' : ''}" id="row_${item.id}">
                                <div class="topic-item-left">
                                    <input type="checkbox" class="topic-checkbox" ${isDone ? 'checked' : ''} 
                                        onchange="window.academyToggleItem('${item.id}')"
                                        aria-label="Mark ${escapeHtml(item.text)} completed">
                                    <div class="topic-content-wrap">
                                        <div class="topic-title">${escapeHtml(item.text)}</div>
                                        ${item.details && item.details.length > 0 ? `
                                            <div class="topic-details-tags">
                                                ${item.details.map(d => `<span class="detail-tag">${escapeHtml(d)}</span>`).join('')}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                                <div class="topic-actions">
                                    <button type="button" class="item-action-btn ${hasNote ? 'has-notes' : ''}" 
                                        title="${hasNote ? 'Edit your notes' : 'Add personal notes'}" 
                                        onclick="window.academyOpenNotes('${item.id}', '${escapeHtml(item.text.replace(/'/g, "\\'"))}')">
                                        ${SVG_NOTE}
                                    </button>
                                    <button type="button" class="item-action-btn" title="Add to Today's Tasks" 
                                        onclick="window.academySendToToday('${escapeHtml(item.text.replace(/'/g, "\\'"))}', '${track.category}')">
                                        ${SVG_CALENDAR}
                                    </button>
                                </div>
                            </div>
                        `);
                    });
                }

                htmlChunks.push(`
                        </div>
                    </div>
                `);
            });
        });

        if (totalRenderedModules === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:8px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="m14 8-6 6"/><path d="m8 8 6 6"/></svg>
                    <p>No modules found matching "<strong>${escapeHtml(searchQuery)}</strong>"</p>
                </div>
            `;
        } else {
            container.innerHTML = htmlChunks.join('');
        }
    }

    // =========================================================================
    // INSTANT TOGGLE ITEM (< 2ms execution time, zero DOM lag)
    // =========================================================================
    window.academyToggleItem = function(itemId) {
        const isNowDone = !progressMap[itemId];
        progressMap[itemId] = isNowDone;

        // 1. Direct Row Mutation (0ms)
        const row = document.getElementById(`row_${itemId}`);
        if (row) {
            row.classList.toggle('is-done', isNowDone);
            const checkbox = row.querySelector('.topic-checkbox');
            if (checkbox && checkbox.checked !== isNowDone) {
                checkbox.checked = isNowDone;
            }
        }

        // 2. O(1) Counter Adjustments
        const meta = itemIndex[itemId];
        if (meta) {
            const delta = isNowDone ? 1 : -1;
            if (trackStats[meta.trackId]) trackStats[meta.trackId].completed += delta;
            if (levelStats[meta.lvl.id]) levelStats[meta.lvl.id].completed += delta;

            // 3. Direct Module Badge Mutation
            const badge = document.getElementById(`badge_${meta.mod.id}`);
            if (badge) {
                const actionable = (meta.mod.items || []).filter(i => !i.isHeading);
                let modCompleted = 0;
                for (let i = 0; i < actionable.length; i++) {
                    if (progressMap[actionable[i].id]) modCompleted++;
                }
                const total = actionable.length;
                badge.textContent = `${modCompleted}/${total} done`;
                badge.classList.toggle('completed', total > 0 && modCompleted === total);
            }

            // 4. Direct Level Pill Mutation
            updateLevelPillDOM(meta.lvl.id);
        }

        // 5. Direct Hero & Next-Up Mutations (no innerHTML, no lucide scan)
        updateHeroStatsDOM();
        updateNextUpDOM();

        // 6. Fast Persistence
        saveProgressImmediate();
    };

    // Toggle Module Accordion (0ms)
    window.academyToggleModule = function(modId) {
        const card = document.querySelector(`.module-card[data-mod-id="${modId}"]`);
        if (card) card.classList.toggle('expanded');
    };

    // Expand / Collapse All
    window.academyToggleAllModules = function(expand) {
        document.querySelectorAll('.module-card').forEach(card => {
            card.classList.toggle('expanded', expand);
        });
    };

    // Send Item to Today's Tasks
    function sendItemToToday(itemText, category) {
        try {
            let todos = {};
            try {
                todos = JSON.parse(localStorage.getItem('dashboard_todos')) || {};
            } catch {
                todos = {};
            }

            const targetCat = (category === 'cyber' ? 'cyber' : 'lang');
            if (!Array.isArray(todos[targetCat])) {
                todos[targetCat] = [];
            }

            const todayKey = localDateKey();
            const cleanTitle = `[Academy] ${itemText}`.slice(0, 200);

            // Avoid duplicate identical task due today
            const exists = todos[targetCat].some(t => t.text === cleanTitle && t.dueDate === todayKey);
            if (exists) {
                showToast(`Already on Today's task list!`, 'success');
                return;
            }

            const newTask = {
                id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                text: cleanTitle,
                priority: 'medium',
                recurrence: 'once',
                dueDate: todayKey,
                scheduleStart: todayKey,
                completed: false,
                completedDates: [],
                weeklyTargetId: ''
            };

            todos[targetCat].unshift(newTask);
            localStorage.setItem('dashboard_todos', JSON.stringify(todos));

            showToast(`Added "${cleanTitle.slice(0, 32)}..." to Today's Tasks!`, 'success');
        } catch (e) {
            console.error('Error adding to today tasks:', e);
            showToast('Unable to add task to Today', 'error');
        }
    }
    window.academySendToToday = sendItemToToday;

    // Notes Modal
    window.academyOpenNotes = function(itemId, itemText) {
        currentNoteItemId = itemId;
        const modal = document.getElementById('notesModalOverlay');
        const topicElem = document.getElementById('notesTopicName');
        const textarea = document.getElementById('notesTextarea');

        if (topicElem) topicElem.textContent = itemText;
        if (textarea) textarea.value = notesMap[itemId] || '';
        if (modal) modal.classList.add('active');

        setTimeout(() => textarea && textarea.focus(), 50);
    };

    window.academyCloseNotes = function() {
        const modal = document.getElementById('notesModalOverlay');
        if (modal) modal.classList.remove('active');
        currentNoteItemId = null;
    };

    window.academySaveNotes = function() {
        if (!currentNoteItemId) return;
        const textarea = document.getElementById('notesTextarea');
        const content = textarea ? textarea.value.trim() : '';

        if (content) {
            notesMap[currentNoteItemId] = content;
        } else {
            delete notesMap[currentNoteItemId];
        }

        saveNotesData();
        window.academyCloseNotes();

        const row = document.getElementById(`row_${currentNoteItemId}`);
        if (row) {
            const noteBtn = row.querySelector('.item-action-btn');
            if (noteBtn) noteBtn.classList.toggle('has-notes', !!content);
        }

        showToast('Personal notes saved!', 'success');
    };

    // Filter Buttons (All, Remaining, Completed)
    function setupFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilter = btn.getAttribute('data-filter');
                renderModules();
            };
        });
    }

    // Search Input Setup
    function setupSearch() {
        const input = document.getElementById('curriculumSearchInput');
        if (!input) return;

        let debounce = null;
        input.addEventListener('input', e => {
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                searchQuery = e.target.value.trim();
                renderModules();
            }, 120);
        });
    }

    // Track Navigation Click Handlers
    function setupTrackTabs() {
        document.querySelectorAll('.track-tab-btn').forEach(btn => {
            btn.onclick = () => {
                const trackId = btn.getAttribute('data-track');
                selectTrack(trackId);
            };
        });
    }

    // Reset Progress Modal / Action
    window.academyResetTrackProgress = function() {
        const track = curriculum[activeTrackId];
        if (!confirm(`Are you sure you want to reset all progress for ${track ? track.title : 'this track'}?`)) {
            return;
        }

        (track.levels || []).forEach(lvl => {
            if (levelStats[lvl.id]) levelStats[lvl.id].completed = 0;
            (lvl.modules || []).forEach(mod => {
                (mod.items || []).forEach(item => {
                    delete progressMap[item.id];
                });
            });
        });

        if (trackStats[activeTrackId]) trackStats[activeTrackId].completed = 0;

        saveProgressImmediate();
        renderTrackHero();
        renderLevelPills();
        renderNextUpBanner();
        renderModules();
        showToast('Track progress reset.', 'success');
    };

    // Initialization
    function init() {
        initTheme();
        buildFastIndexes();
        setupTrackTabs();
        setupFilterButtons();
        setupSearch();

        // Select initial track
        selectTrack(activeTrackId);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
