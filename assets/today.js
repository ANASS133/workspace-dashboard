/**
 * Focus / Today Mode Controller
 * Distraction-free single-day task execution and focus tracking.
 */

const focusCategories = ['lang', 'cyber', 'train', 'din', 'work', 'proj'];

function createLocalId() {
    return globalThis.crypto?.randomUUID?.() || `task-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function cleanText(value, max = 200) {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/**
 * Read focus tasks directly from synchronized storage.
 * Deduplicates by normalized title within each category and resolves conflicts.
 */
function readFocusTasks() {
    let tasks = {};
    try {
        const raw = localStorage.getItem('dashboard_todos');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                tasks = parsed;
            }
        }
    } catch {
        tasks = {};
    }

    // Ensure categories exist and deduplicate by normalized title within each category
    focusCategories.forEach(cat => {
        if (!Array.isArray(tasks[cat])) {
            tasks[cat] = [];
            return;
        }
        const seen = new Map();
        tasks[cat].forEach(t => {
            if (!t || typeof t.text !== 'string') return;
            const norm = t.text.trim().toLowerCase();
            if (!norm) return;
            if (!seen.has(norm)) {
                seen.set(norm, t);
            } else {
                const existing = seen.get(norm);
                const tTime = Number(t.updatedAt || 0);
                const exTime = Number(existing.updatedAt || 0);
                if (tTime > exTime) {
                    seen.set(norm, t);
                }
            }
        });
        tasks[cat] = Array.from(seen.values());
    });

    return tasks;
}

function focusLastCheck() {
    return localStorage.getItem('dashboard_last_recurrence_check') ||
           localStorage.getItem('dashboard_last_daily_reset') ||
           localDateKey();
}

/**
 * Filter tasks that are due or scheduled for today
 */
function focusEntries(tasks, today, lastCheck) {
    return focusCategories.flatMap(category => {
        const list = Array.isArray(tasks[category]) ? tasks[category] : [];
        return list.flatMap((task, index) => {
            if (!task || typeof task.text !== 'string') return [];

            const isDaily = task.recurrence === 'habit' || task.recurring;
            const occursToday = typeof taskOccursOn === 'function'
                ? taskOccursOn(task, today)
                : (task.dueDate === today || isDaily);

            // Include if occurs today, or if daily habit without explicit date, or if explicitly scheduled today
            if (!occursToday && !(isDaily && !task.dueDate) && task.dueDate !== today) {
                return [];
            }

            let completed = false;
            if (typeof taskCompletedOn === 'function' && task.dueDate) {
                completed = taskCompletedOn(task, today);
            } else if (!task.dueDate) {
                completed = (task.completedDates || []).includes(today) || (lastCheck === today && task.completed);
            } else {
                completed = Boolean(task.completed);
            }

            return [{ category, index, task, completed: Boolean(completed) }];
        });
    });
}

/**
 * Main Render Function
 */
function renderFocus() {
    try {
        const today = localDateKey();
        const tasks = readFocusTasks();
        const entries = focusEntries(tasks, today, focusLastCheck());

        // Render date
        const dateEl = document.getElementById('todayDate');
        if (dateEl) {
            dateEl.textContent = new Intl.DateTimeFormat(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            }).format(new Date());
        }

        // Render priority groups
        const priorityKeys = [
            { id: 'high', name: 'Must Do' },
            { id: 'medium', name: 'Should Do' },
            { id: 'low', name: 'Optional' }
        ];

        priorityKeys.forEach(({ id }) => {
            const list = document.getElementById(`focus-${id}`);
            if (!list) return;
            list.replaceChildren();

            const group = entries.filter(entry => {
                const p = ['high', 'medium', 'low'].includes(entry.task.priority)
                    ? entry.task.priority
                    : 'medium';
                return p === id;
            });

            if (!group.length) {
                const empty = document.createElement('li');
                empty.className = 'empty-task-placeholder';
                empty.textContent = 'No tasks scheduled.';
                list.appendChild(empty);
            } else {
                group.forEach(entry => {
                    const row = document.createElement('li');
                    row.className = `task-item ${entry.completed ? 'completed' : ''}`;
                    row.dataset.taskId = entry.task.id || '';

                    // Label with custom checkbox
                    const label = document.createElement('label');
                    label.className = 'task-label';

                    const checkboxWrap = document.createElement('span');
                    checkboxWrap.className = 'custom-checkbox';

                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.checked = entry.completed;
                    input.setAttribute('aria-label', `Mark "${entry.task.text}" as ${entry.completed ? 'incomplete' : 'complete'}`);
                    input.addEventListener('change', () => {
                        playCheckSound(input.checked);
                        completeFocusTask(entry, today, input.checked);
                    });

                    const box = document.createElement('span');
                    box.className = 'checkbox-box';
                    box.innerHTML = `<svg class="checkbox-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

                    checkboxWrap.append(input, box);

                    const title = document.createElement('span');
                    title.className = 'task-title';
                    title.textContent = entry.task.text;

                    label.append(checkboxWrap, title);

                    // Delete button
                    const deleteBtn = document.createElement('button');
                    deleteBtn.type = 'button';
                    deleteBtn.className = 'task-delete-btn';
                    deleteBtn.title = 'Remove task';
                    deleteBtn.setAttribute('aria-label', `Remove "${entry.task.text}"`);
                    deleteBtn.innerHTML = `<i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>`;
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        deleteFocusTask(entry);
                    });

                    row.append(label, deleteBtn);
                    list.appendChild(row);
                });
            }
        });

        // Compute counts
        const done = entries.filter(e => e.completed).length;
        const total = entries.length;
        const percent = total > 0 ? Math.round((done / total) * 100) : 0;

        // Update progress badges and counts
        const countEl = document.getElementById('focusCount');
        if (countEl) countEl.textContent = `${done} / ${total} completed`;

        const percentBadge = document.getElementById('focusPercentBadge');
        if (percentBadge) percentBadge.textContent = `${percent}%`;

        const progressTrack = document.getElementById('focusProgress');
        if (progressTrack) {
            progressTrack.setAttribute('aria-valuenow', percent);
            progressTrack.setAttribute('aria-valuetext', `${percent}% complete`);
        }

        const fillEl = document.getElementById('focusFill');
        if (fillEl) fillEl.style.width = `${percent}%`;

        // Update footer message
        const messageEl = document.getElementById('focusMessage');
        if (messageEl) {
            if (total === 0) {
                messageEl.textContent = 'Your day is clear. Add tasks above to focus on what matters today.';
            } else if (done === total) {
                messageEl.textContent = 'Outstanding work! All tasks for today are completed. Take a well-deserved rest.';
                triggerCelebration();
            } else {
                messageEl.textContent = 'Focus on one item at a time. Only today’s essential priorities appear here.';
            }
        }

        const errEl = document.getElementById('focusError');
        if (errEl) errEl.hidden = true;

        if (window.lucide) {
            lucide.createIcons();
        }
    } catch (err) {
        showFocusError('Tasks could not be loaded. Please return to the dashboard to inspect your data.');
    }
}

function showFocusError(message) {
    const error = document.getElementById('focusError');
    if (error) {
        error.textContent = message;
        error.hidden = false;
    }
}

/**
 * Toggle task completion and persist in localStorage
 */
function completeFocusTask(entry, date, completed) {
    try {
        const tasks = readFocusTasks();
        const task = entry.task.id
            ? tasks[entry.category]?.find(t => t.id === entry.task.id)
            : tasks[entry.category]?.[entry.index];

        if (!task) { renderFocus(); return; }

        if (typeof setOccurrenceCompleted === 'function') {
            setOccurrenceCompleted(task, date, completed);
        } else {
            task.completedDates = (task.completedDates || []).filter(d => d !== date);
            if (completed) task.completedDates.push(date);
        }

        if (!task.dueDate || task.dueDate === date || task.recurrence === 'once') {
            task.completed = completed;
        }
        task.updatedAt = Date.now();

        localStorage.setItem('dashboard_todos', JSON.stringify(tasks));

        // Sync productivity completion streak dates
        const entries = focusEntries(tasks, date, focusLastCheck());
        let storedDates;
        try {
            storedDates = JSON.parse(localStorage.getItem('productivity_completion_dates') || '[]');
        } catch {
            storedDates = [];
        }
        const dates = new Set(Array.isArray(storedDates) ? storedDates : []);
        if (entries.length && entries.every(e => e.completed)) {
            dates.add(date);
        } else {
            dates.delete(date);
        }
        localStorage.setItem('productivity_completion_dates', JSON.stringify([...dates].sort()));

        renderFocus();
    } catch {
        renderFocus();
        showFocusError('Failed to update task state. Please try again.');
    }
}

/**
 * Delete a task directly from Today mode
 */
function deleteFocusTask(entry) {
    try {
        const tasks = readFocusTasks();
        const taskId = entry.task.id;

        // 1. Record in tombstones by ID only
        let tombstones = {};
        try { tombstones = JSON.parse(localStorage.getItem('dashboard_deleted_tasks') || '{}'); } catch {}
        if (taskId) tombstones[taskId] = Date.now();
        localStorage.setItem('dashboard_deleted_tasks', JSON.stringify(tombstones));

        // 2. Remove task from all categories
        focusCategories.forEach(cat => {
            if (Array.isArray(tasks[cat])) {
                tasks[cat] = tasks[cat].filter(t => {
                    if (!t) return false;
                    if (taskId && t.id === taskId) return false;
                    return true;
                });
            }
        });

        localStorage.setItem('dashboard_todos', JSON.stringify(tasks));
        renderFocus();

        // 3. Push immediately to Supabase
        if (window.WorkspaceSync && typeof window.WorkspaceSync.schedulePush === 'function') {
            window.WorkspaceSync.schedulePush('dashboard_deleted_tasks', JSON.stringify(tombstones));
            window.WorkspaceSync.schedulePush('dashboard_todos', JSON.stringify(tasks));
        }
    } catch {
        showFocusError('Could not remove task. Please try again.');
    }
}

/**
 * Add a new task to Today under a specific priority
 */
function addFocusTask(priority, text) {
    const clean = cleanText(text, 200);
    if (!clean) return;

    try {
        const tasks = readFocusTasks();
        const today = localDateKey();

        // Categorize smartly based on keywords
        let category = 'work';
        const lower = clean.toLowerCase();
        if (/surat|quran|salat|prayer|hadith|din|dua|dhikr/i.test(lower)) category = 'din';
        else if (/german|english|french|spanish|language|vocab|duolingo/i.test(lower)) category = 'lang';
        else if (/cyber|security|hack|linux|network|code|coding/i.test(lower)) category = 'cyber';
        else if (/gym|workout|run|training|exercise|pushups|fitness/i.test(lower)) category = 'train';
        else if (/project|app|build|design|portfolio/i.test(lower)) category = 'proj';

        if (!Array.isArray(tasks[category])) tasks[category] = [];

        const newTask = {
            id: createLocalId(),
            text: clean,
            completed: false,
            priority: priority,
            recurrence: 'once',
            dueDate: today,
            scheduleStart: today,
            completedDates: [],
            subtasks: [],
            updatedAt: Date.now()
        };

        tasks[category].unshift(newTask);

        // Clear any deletion tombstone for this task ID or text
        try {
            let tombstones = JSON.parse(localStorage.getItem('dashboard_deleted_tasks') || '{}');
            let changed = false;
            if (tombstones[newTask.id]) { delete tombstones[newTask.id]; changed = true; }
            const normText = clean.toLowerCase();
            if (normText && tombstones[normText]) { delete tombstones[normText]; changed = true; }
            if (changed) {
                localStorage.setItem('dashboard_deleted_tasks', JSON.stringify(tombstones));
                if (window.WorkspaceSync && typeof window.WorkspaceSync.schedulePush === 'function') {
                    window.WorkspaceSync.schedulePush('dashboard_deleted_tasks', JSON.stringify(tombstones));
                }
            }
        } catch (_) {}

        localStorage.setItem('dashboard_todos', JSON.stringify(tasks));
        if (window.WorkspaceSync && typeof window.WorkspaceSync.schedulePush === 'function') {
            window.WorkspaceSync.schedulePush('dashboard_todos', JSON.stringify(tasks));
        }
        renderFocus();
    } catch {
        showFocusError('Could not add task. Please try again.');
    }
}

/**
 * Sound effect feedback using Web Audio API (no external asset needed)
 */
function playCheckSound(isComplete) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const now = ctx.currentTime;

        if (isComplete) {
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        } else {
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        }

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
    } catch {
        // AudioContext not supported or permission denied
    }
}

/**
 * Confetti Canvas Celebration
 */
let celebrationTriggered = false;
function triggerCelebration() {
    if (celebrationTriggered) return;
    celebrationTriggered = true;

    const canvas = document.getElementById('celebrationCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#6366f1'];

    for (let i = 0; i < 70; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.5) * 14 - 3,
            size: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            life: 1
        });
    }

    let animationFrame;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.25; // gravity
            p.rotation += p.rotationSpeed;
            p.life -= 0.015;

            if (p.life > 0) {
                alive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });

        if (alive) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationFrame);
            setTimeout(() => { celebrationTriggered = false; }, 4000);
        }
    }
    animate();
}

/**
 * Focus / Pomodoro Timer Logic
 */
let timerInterval = null;
let timerSecondsLeft = 25 * 60;
let timerRunning = false;

function initFocusTimer() {
    const timerCard = document.getElementById('focusTimerCard');
    const toggleBtn = document.getElementById('timerToggleBtn');
    const startBtn = document.getElementById('timerStartBtn');
    const resetBtn = document.getElementById('timerResetBtn');
    const display = document.getElementById('timerDisplay');
    const startText = document.getElementById('timerStartText');
    const playIcon = document.getElementById('timerPlayIcon');
    const presetBtns = document.querySelectorAll('.timer-preset-btn');

    if (!toggleBtn || !timerCard) return;

    toggleBtn.addEventListener('click', () => {
        timerCard.hidden = !timerCard.hidden;
        if (window.lucide) lucide.createIcons();
    });

    function updateDisplay() {
        const mins = Math.floor(timerSecondsLeft / 60);
        const secs = timerSecondsLeft % 60;
        if (display) {
            display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    }

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const mins = parseInt(btn.dataset.minutes, 10) || 25;
            timerSecondsLeft = mins * 60;
            clearInterval(timerInterval);
            timerRunning = false;
            if (startText) startText.textContent = 'Start Focus';
            if (playIcon) playIcon.setAttribute('data-lucide', 'play');
            updateDisplay();
            if (window.lucide) lucide.createIcons();
        });
    });

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (timerRunning) {
                clearInterval(timerInterval);
                timerRunning = false;
                if (startText) startText.textContent = 'Resume';
                if (playIcon) playIcon.setAttribute('data-lucide', 'play');
            } else {
                timerRunning = true;
                if (startText) startText.textContent = 'Pause';
                if (playIcon) playIcon.setAttribute('data-lucide', 'pause');

                timerInterval = setInterval(() => {
                    if (timerSecondsLeft > 0) {
                        timerSecondsLeft--;
                        updateDisplay();
                    } else {
                        clearInterval(timerInterval);
                        timerRunning = false;
                        if (startText) startText.textContent = 'Start Focus';
                        if (playIcon) playIcon.setAttribute('data-lucide', 'play');
                        playTimerCompleteChime();
                        alert('Deep work interval completed! Take a 5-minute break.');
                    }
                }, 1000);
            }
            if (window.lucide) lucide.createIcons();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            timerRunning = false;
            const activePreset = document.querySelector('.timer-preset-btn.active');
            const mins = activePreset ? parseInt(activePreset.dataset.minutes, 10) : 25;
            timerSecondsLeft = mins * 60;
            if (startText) startText.textContent = 'Start Focus';
            if (playIcon) playIcon.setAttribute('data-lucide', 'play');
            updateDisplay();
            if (window.lucide) lucide.createIcons();
        });
    }

    updateDisplay();
}

function playTimerCompleteChime() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const time = ctx.currentTime + i * 0.14;
            osc.frequency.setValueAtTime(freq, time);
            gain.gain.setValueAtTime(0.12, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.45);
        });
    } catch {}
}

/**
 * Dark / Light Theme Toggle
 */
function initThemeToggle() {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;

    const savedTheme = localStorage.getItem('dashboard_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('dashboard_theme', next);
    });
}

/**
 * Setup Quick Add Triggers
 */
function initQuickAdd() {
    ['high', 'medium', 'low'].forEach(priority => {
        const trigger = document.querySelector(`.quick-add-trigger[data-priority="${priority}"]`);
        const form = document.getElementById(`addForm-${priority}`);
        if (!trigger || !form) return;

        const input = form.querySelector('.quick-add-input');
        const submitBtn = form.querySelector('.btn-submit-task');
        const cancelBtn = form.querySelector('.btn-cancel-task');

        trigger.addEventListener('click', () => {
            form.hidden = false;
            trigger.hidden = true;
            input.focus();
        });

        function submit() {
            const val = input.value.trim();
            if (val) {
                addFocusTask(priority, val);
                input.value = '';
            }
            form.hidden = true;
            trigger.hidden = false;
        }

        function cancel() {
            input.value = '';
            form.hidden = true;
            trigger.hidden = false;
        }

        submitBtn.addEventListener('click', submit);
        cancelBtn.addEventListener('click', cancel);

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submit();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancel();
            }
        });
    });
}

// Global Event Listeners
window.addEventListener('storage', event => {
    if (!event.key || ['dashboard_todos', 'dashboard_last_recurrence_check', 'dashboard_theme'].includes(event.key)) {
        if (event.key === 'dashboard_theme') {
            document.documentElement.setAttribute('data-theme', event.newValue || 'dark');
        } else {
            renderFocus();
        }
    }
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) renderFocus();
});

// Periodic refresh every minute
setInterval(() => {
    if (!document.hidden) renderFocus();
}, 60000);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initFocusTimer();
    initQuickAdd();
    renderFocus();
});

// Direct initialization in case script loads after DOM
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initThemeToggle();
    initFocusTimer();
    initQuickAdd();
    renderFocus();
}

window.addEventListener('workspace-synced', () => {
    renderFocus();
});
window.addEventListener('supabase-sync-status', (e) => {
    if (e.detail?.status === 'synced') {
        renderFocus();
    }
});
window.addEventListener('storage', (e) => {
    if (e.key === 'dashboard_todos' || e.key === 'dashboard_deleted_tasks') {
        renderFocus();
    }
});
if (window.WorkspaceSync && typeof window.WorkspaceSync.init === 'function') {
    window.WorkspaceSync.init();
    window.WorkspaceSync.syncNow();
}

// Service Worker Registration
if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
}
