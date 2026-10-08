/**
 * Calisthenics Coach Engine — High Performance & Live Comparison
 * Three Core Pages: Weekly Program | Workout | History & Progress
 */

(function () {
    'use strict';

    const STORAGE_KEYS = {
        THEME: 'dashboard_theme',
        HISTORY: 'calisthenics_history_v1',
        ACTIVE_SESSION: 'calisthenics_active_session_v1',
        TARGETS: 'calisthenics_recommendations_v1',
        READINESS: 'calisthenics_readiness_v1',
        GOALS: 'calisthenics_goals_v1',
        SOUND: 'calisthenics_sound_v1'
    };

    // =========================================================================
    // 1. EXACT 7-DAY BASELINE PROGRAM
    // =========================================================================
    const BASELINE_PROGRAM = {
        monday: {
            id: 'monday',
            dayName: 'Monday',
            dayIndex: 1,
            title: 'Rest & Stretching',
            type: 'rest_stretch',
            focus: 'Active recovery, shoulder & hip mobility, spinal decompression',
            exercises: [
                { id: 'sh_stretch', name: 'Cross-body Shoulder Stretch', type: 'timed', sets: 2, targetDuration: 30, targetReps: null, note: '30s per side' },
                { id: 'cat_cow', name: 'Cat-Cow', type: 'reps', sets: 2, targetReps: 10, targetDuration: null, note: 'Slow fluid spinal flexion & extension' },
                { id: 'hip_flexor', name: 'Hip Flexor Stretch', type: 'timed', sets: 2, targetDuration: 30, targetReps: null, note: '30s each side' },
                { id: 'child_pose', name: "Child's Pose", type: 'timed', sets: 2, targetDuration: 30, targetReps: null, note: 'Deep pelvic grounding' }
            ]
        },
        tuesday: {
            id: 'tuesday',
            dayName: 'Tuesday',
            dayIndex: 2,
            title: 'Push + ABS',
            type: 'workout',
            focus: 'Chest, shoulders, triceps, anterior core',
            exercises: [
                { id: 'pushups_tue', name: 'Push-ups', type: 'reps', sets: 4, targetReps: 10, category: 'pushups', note: 'Strict ROM, chest to floor' },
                { id: 'assisted_dips_tue', name: 'Assisted Dips', type: 'reps_assistance', sets: 3, targetReps: 5, defaultAssistance: 'Medium Band', category: 'assisted_dips', note: 'Controlled descent to 90 degrees' },
                { id: 'pike_pushups_tue', name: 'Pike Push-ups', type: 'reps', sets: 3, targetReps: 8, category: 'pike', note: 'Elevated hips, head tracking forward' },
                { id: 'hanging_knee_tue', name: 'Hanging Knee Raises', type: 'reps', sets: 3, targetReps: 12, category: 'hanging_knee', note: 'Strict pull from bar, no swinging' },
                { id: 'reverse_crunches_tue', name: 'Reverse Crunches', type: 'reps', sets: 3, targetReps: 15, category: 'reverse_crunches', note: 'Posterior pelvic tilt' },
                { id: 'plank_tue', name: 'Plank', type: 'timed', sets: 3, targetDuration: 45, category: 'plank', note: 'Forearm plank, glutes squeezed' }
            ]
        },
        wednesday: {
            id: 'wednesday',
            dayName: 'Wednesday',
            dayIndex: 3,
            title: 'Pull',
            type: 'workout',
            focus: 'Lats, upper back, biceps, grip & decompression',
            exercises: [
                { id: 'pullups_wed', name: 'Pull-ups', type: 'reps', sets: 4, targetReps: 2, category: 'pullups', note: 'Dead hang to chin over bar' },
                { id: 'australian_rows_wed', name: 'Australian Rows', type: 'reps', sets: 3, targetReps: 12, category: 'rows', note: 'Chest to bar, full scapular retraction' },
                { id: 'assisted_pullups_wed', name: 'Assisted Pull-ups', type: 'reps_assistance', sets: 3, targetReps: 5, defaultAssistance: 'Medium Band', category: 'assisted_pullups', note: 'Controlled tempo with band' },
                { id: 'band_biceps_wed', name: 'Band Biceps Curls', type: 'reps_band', sets: 3, targetReps: 12, defaultBand: 'Medium Band', category: 'band_curls', note: 'Squeeze biceps at peak' },
                { id: 'dead_hang_wed', name: 'Dead Hang', type: 'timed', sets: 2, targetDuration: 30, category: 'dead_hang', note: 'Active or relaxed grip hang' }
            ]
        },
        thursday: {
            id: 'thursday',
            dayName: 'Thursday',
            dayIndex: 4,
            title: 'Rest & Stretching',
            type: 'rest_stretch',
            focus: 'Upper body decompression, chest opening, posterior relief',
            exercises: [
                { id: 'triceps_stretch', name: 'Overhead Triceps Stretch', type: 'timed', sets: 2, targetDuration: 30, targetReps: null, note: '30s each arm' },
                { id: 'doorway_chest', name: 'Doorway Chest Stretch', type: 'timed', sets: 2, targetDuration: 30, targetReps: null, note: 'Pectoral opening' },
                { id: 'seated_hamstring', name: 'Seated Hamstring Stretch', type: 'timed', sets: 2, targetDuration: 30, targetReps: null, note: 'Hinge at hips with straight back' },
                { id: 'supine_twist', name: 'Supine Spinal Twist', type: 'timed', sets: 2, targetDuration: 30, targetReps: null, note: 'Knees to floor, gentle rotation' }
            ]
        },
        friday: {
            id: 'friday',
            dayName: 'Friday',
            dayIndex: 5,
            title: 'Legs + Push-ups + ABS',
            type: 'workout',
            focus: 'Quads, posterior chain, chest volume, core stability',
            exercises: [
                { id: 'pushups_fri', name: 'Push-ups', type: 'reps', sets: 4, targetReps: 12, category: 'pushups', note: '4 sets of 12 reps' },
                { id: 'backpack_squats_fri', name: 'Backpack Squats', type: 'reps_weight', sets: 3, targetReps: 15, defaultWeight: 10, category: 'backpack_squats', note: 'Deep squat with backpack' },
                { id: 'bulgarian_split_fri', name: 'Bulgarian Split Squats', type: 'reps', sets: 3, targetReps: 10, category: 'single_leg', note: 'Rear foot elevated' },
                { id: 'backpack_rdl_fri', name: 'Backpack Romanian Deadlifts', type: 'reps_weight', sets: 3, targetReps: 12, defaultWeight: 10, category: 'backpack_rdl', note: 'Hip hinge, stretch in hamstrings' },
                { id: 'sliding_curls_fri', name: 'Sliding Leg Curls', type: 'reps', sets: 2, targetReps: 10, category: 'hamstring_curls', note: 'Towel or sliders on floor' },
                { id: 'calf_raises_fri', name: 'Calf Raises', type: 'reps', sets: 3, targetReps: 20, category: 'calves', note: 'Full stretch, 1s pause at top' },
                { id: 'reverse_crunches_fri', name: 'Reverse Crunches', type: 'reps', sets: 3, targetReps: 15, category: 'reverse_crunches', note: 'Posterior pelvic tilt' },
                { id: 'rkc_plank_fri', name: 'RKC Plank', type: 'timed', sets: 3, targetDuration: 30, category: 'rkc_plank', note: 'Maximal tension hold' }
            ]
        },
        saturday: {
            id: 'saturday',
            dayName: 'Saturday',
            dayIndex: 6,
            title: 'Upper Body + Dips',
            type: 'workout',
            focus: 'Push/pull balance, dips, vertical pressing, delts',
            exercises: [
                { id: 'pushups_sat', name: 'Push-ups', type: 'reps', sets: 3, targetReps: 12, category: 'pushups', note: 'Clean lockout, controlled eccentric' },
                { id: 'pullups_sat', name: 'Pull-ups', type: 'reps', sets: 3, targetReps: 2, category: 'pullups', note: 'Clean chin clearance' },
                { id: 'assisted_dips_sat', name: 'Assisted Dips', type: 'reps_assistance', sets: 3, targetReps: 5, defaultAssistance: 'Medium Band', category: 'assisted_dips', note: 'Strict parallel bar dips' },
                { id: 'australian_rows_sat', name: 'Australian Rows', type: 'reps', sets: 3, targetReps: 10, category: 'rows', note: 'Horizontal pulling' },
                { id: 'pike_pushups_sat', name: 'Pike Push-ups', type: 'reps', sets: 2, targetReps: 8, category: 'pike', note: 'Overhead pressing path' },
                { id: 'band_face_pulls_sat', name: 'Band Face Pulls', type: 'reps_band', sets: 2, targetReps: 15, defaultBand: 'Light Band', category: 'face_pulls', note: 'Rotator cuff health' }
            ]
        },
        sunday: {
            id: 'sunday',
            dayName: 'Sunday',
            dayIndex: 0,
            title: 'Sprints + ABS',
            type: 'sprint_core',
            focus: 'Explosive acceleration, speed endurance & core',
            exercises: [
                { id: 'warmup_sun', name: 'Dynamic Warm-up', type: 'timed', sets: 1, targetDuration: 600, note: '10–15 min warm-up' },
                { id: 'progressive_runs_sun', name: 'Progressive Runs', type: 'sprint', sets: 3, distance: '30m', targetReps: 3, note: 'Building speed: 60%, 75%, 85%' },
                { id: 'sprints_sun', name: 'Sprints (Max Velocity)', type: 'sprint', sets: 4, distance: '40m', targetReps: 4, note: '100% explosive sprint' },
                { id: 'hanging_knee_sun', name: 'Hanging Knee Raises', type: 'reps', sets: 3, targetReps: 12, category: 'hanging_knee', note: 'Strict hanging raises' },
                { id: 'reverse_crunches_sun', name: 'Reverse Crunches', type: 'reps', sets: 3, targetReps: 15, category: 'reverse_crunches', note: 'Control the eccentric' },
                { id: 'plank_sun', name: 'Plank', type: 'timed', sets: 3, targetDuration: 45, category: 'plank', note: 'Solid tension hold' }
            ]
        }
    };

    const ASSISTANCE_LEVELS = ['Heavy Band', 'Medium Band', 'Light Band', 'Micro Band', 'Bodyweight (None)'];

    // State Variables
    let activeWorkoutSession = null;
    let stopwatchInterval = null;
    let stopwatchSeconds = 0;
    let isStopwatchRunning = false;

    // Persistent Drift-Proof Rest Timer
    let restTimerInterval = null;
    let restTargetTimestamp = null;
    let restConfiguredSeconds = 90;
    let isRestRunning = false;
    let soundEnabled = true;

    // Native Web Audio Synthesizer (Zero dependencies, offline)
    let audioCtx = null;
    function getAudioCtx() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (_) {}
    }

    function playDing() {
        playTone(587.33, 'sine', 0.08, 0.12);
        setTimeout(() => playTone(880, 'sine', 0.22, 0.15), 60);
    }

    function playRestDoneAlert() {
        playTone(440, 'triangle', 0.12, 0.2);
        setTimeout(() => playTone(659.25, 'triangle', 0.35, 0.25), 120);
    }

    function playFanfare() {
        playTone(523.25, 'triangle', 0.1, 0.15);
        setTimeout(() => playTone(659.25, 'triangle', 0.1, 0.15), 90);
        setTimeout(() => playTone(783.99, 'triangle', 0.12, 0.15), 180);
        setTimeout(() => playTone(1046.50, 'triangle', 0.35, 0.2), 290);
    }

    // Storage Utilities
    function loadStorage(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function saveStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (_) {}
    }

    function getTodayKey() {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    function getTodayDayId() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[new Date().getDay()];
    }

    function formatTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function escapeHtml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // =========================================================================
    // 2. EXERCISE PERFORMANCE & PROGRESSION RETRIEVER
    // =========================================================================
    const PerformanceEngine = {
        /**
         * Returns:
         * - lastPerformance: Array of actual reps/seconds or null
         * - lastSummaryText: string e.g. "12 / 12 / 12"
         * - todayTarget: Array of numbers e.g. [13, 12, 12]
         * - todayTargetText: string e.g. "13 / 12 / 12"
         * - reason: string
         */
        getExerciseMetrics(exercise, dayId) {
            const history = loadStorage(STORAGE_KEYS.HISTORY, []);
            const pastSessions = history.filter(s =>
                s.exercises && s.exercises.some(e => e.id === exercise.id || e.name === exercise.name)
            );

            const isTimed = exercise.type === 'timed';
            const baseTarget = exercise.targetReps || exercise.targetDuration || 10;
            const setCount = exercise.sets;

            // Check if user has an accepted custom recommendation in storage
            const savedTargets = loadStorage(STORAGE_KEYS.TARGETS, {});
            const customTarget = savedTargets[exercise.name];

            if (pastSessions.length === 0) {
                const targetArr = Array(setCount).fill(baseTarget);
                return {
                    lastPerformance: null,
                    lastSummaryText: 'First session',
                    todayTarget: targetArr,
                    todayTargetText: targetArr.join(' / ') + (isTimed ? 's' : ''),
                    reason: 'Baseline prescribed target.'
                };
            }

            const lastSession = pastSessions[0];
            const lastEx = lastSession.exercises.find(e => e.id === exercise.id || e.name === exercise.name);

            if (!lastEx || !lastEx.sets || lastEx.sets.length === 0) {
                const targetArr = Array(setCount).fill(baseTarget);
                return {
                    lastPerformance: null,
                    lastSummaryText: 'Baseline',
                    todayTarget: targetArr,
                    todayTargetText: targetArr.join(' / ') + (isTimed ? 's' : ''),
                    reason: 'Baseline prescribed target.'
                };
            }

            const lastSets = lastEx.sets;
            const lastActuals = lastSets.map(s => isTimed ? (s.actualDuration || baseTarget) : (s.actualReps || baseTarget));
            const lastSummaryText = lastActuals.join(' / ') + (isTimed ? 's' : '');

            // Use accepted custom target if available
            if (customTarget && Array.isArray(customTarget.target) && customTarget.target.length === setCount) {
                return {
                    lastPerformance: lastActuals,
                    lastSummaryText: lastSummaryText,
                    todayTarget: customTarget.target,
                    todayTargetText: customTarget.target.join(' / ') + (isTimed ? 's' : ''),
                    reason: customTarget.reason || 'Accepted coach target.'
                };
            }

            // Calculate progression based on last session
            const allClean = lastSets.every(s => s.technique === 'clean');
            const avgRir = lastSets.reduce((sum, s) => sum + (s.rir !== undefined ? s.rir : 2), 0) / lastSets.length;
            const targetMet = lastSets.every((s, i) => (isTimed ? s.actualDuration : s.actualReps) >= baseTarget);

            if (targetMet && allClean && avgRir >= 2) {
                // Progression: +1 rep micro-load on set 1
                const nextTarget = [baseTarget + 1, ...Array(setCount - 1).fill(baseTarget)];
                return {
                    lastPerformance: lastActuals,
                    lastSummaryText: lastSummaryText,
                    todayTarget: nextTarget,
                    todayTargetText: nextTarget.join(' / ') + (isTimed ? 's' : ''),
                    reason: 'Completed all sets with good technique and sufficient reserve (+1 rep on Set 1).'
                };
            } else if (!allClean || avgRir <= 1) {
                const targetArr = Array(setCount).fill(baseTarget);
                return {
                    lastPerformance: lastActuals,
                    lastSummaryText: lastSummaryText,
                    todayTarget: targetArr,
                    todayTargetText: targetArr.join(' / ') + (isTimed ? 's' : ''),
                    reason: 'Maintain current target to consolidate motor control.'
                };
            } else {
                const minAchieved = Math.max(1, Math.min(...lastActuals));
                const targetArr = Array(setCount).fill(minAchieved);
                return {
                    lastPerformance: lastActuals,
                    lastSummaryText: lastSummaryText,
                    todayTarget: targetArr,
                    todayTargetText: targetArr.join(' / ') + (isTimed ? 's' : ''),
                    reason: `Consolidate at ${minAchieved} clean reps to rebuild capacity.`
                };
            }
        },

        computeNextRecommendation(exData) {
            const isTimed = exData.type === 'timed';
            const sets = exData.sets;
            const actuals = sets.map(s => isTimed ? (s.actualDuration || 0) : (s.actualReps || 0));
            const targets = sets.map(s => isTimed ? s.targetDuration : s.targetReps);

            const allMet = sets.every((s, i) => actuals[i] >= targets[i]);
            const allClean = sets.every(s => s.technique === 'clean');
            const avgRir = sets.reduce((sum, s) => sum + (s.rir !== undefined ? s.rir : 2), 0) / sets.length;

            if (allMet && allClean && avgRir >= 2) {
                // Advance
                const next = targets.map((t, idx) => idx === 0 ? t + (isTimed ? 5 : 1) : t);
                return {
                    target: next,
                    reason: `Completed all sets with good technique and reserve (+${isTimed ? '5s' : '1 rep'}).`
                };
            } else {
                return {
                    target: targets,
                    reason: 'Maintain target before increasing workload.'
                };
            }
        }
    };

    // =========================================================================
    // 3. PAGE 1: WEEKLY PROGRAM CONTROLLER
    // =========================================================================
    const WeeklyProgramPage = {
        currentWeekOffset: 0,

        render() {
            const container = document.getElementById('daysCardsList');
            if (!container) return;
            container.innerHTML = '';

            const todayId = getTodayDayId();
            const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

            // Header date
            const weekTitle = document.getElementById('weekCalendarTitle');
            if (weekTitle) {
                const now = new Date();
                now.setDate(now.getDate() + (this.currentWeekOffset * 7));
                weekTitle.textContent = `Week of ${now.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            }

            const history = loadStorage(STORAGE_KEYS.HISTORY, []);

            daysOrder.forEach(dayKey => {
                const p = BASELINE_PROGRAM[dayKey];
                const isToday = (dayKey === todayId && this.currentWeekOffset === 0);

                // Check completion in history for this week
                const isCompleted = history.some(s => s.dayId === dayKey && s.date === getTodayKey());

                const card = document.createElement('div');
                card.className = `day-card ${isToday ? 'today' : ''}`;

                let statusBadgeHtml = '';
                if (isCompleted) {
                    statusBadgeHtml = `<span class="day-status-pill completed">✓ Done</span>`;
                } else if (p.type === 'rest_stretch') {
                    statusBadgeHtml = `<span class="day-status-pill rest">Rest &amp; Mobility</span>`;
                } else if (isToday) {
                    statusBadgeHtml = `<span class="day-status-pill today-badge">Today</span>`;
                }

                let exRowsHtml = p.exercises.map(ex => {
                    const metrics = PerformanceEngine.getExerciseMetrics(ex, dayKey);
                    return `
                        <tr>
                            <td class="day-ex-name">${escapeHtml(ex.name)}</td>
                            <td class="day-ex-target">Target: ${escapeHtml(metrics.todayTargetText)}</td>
                        </tr>
                    `;
                }).join('');

                card.innerHTML = `
                    <div class="day-card-header">
                        <div class="day-card-left">
                            <span class="day-name-tag">${p.dayName.slice(0, 3)}</span>
                            <span class="day-workout-title">${escapeHtml(p.title)}</span>
                        </div>
                        <div>${statusBadgeHtml}</div>
                    </div>
                    <div class="day-card-body" ${isToday ? '' : 'style="display: none;"'}>
                        <table class="day-exercises-table">
                            <tbody>${exRowsHtml}</tbody>
                        </table>
                        <div class="day-card-actions">
                            <button type="button" class="btn-start-day" data-day="${dayKey}">
                                <i data-lucide="play" style="width: 14px; height: 14px;"></i>
                                <span>${p.type === 'rest_stretch' ? 'Start Recovery' : 'Start Workout'}</span>
                            </button>
                        </div>
                    </div>
                `;

                // Toggle accordion
                card.querySelector('.day-card-header').addEventListener('click', () => {
                    const body = card.querySelector('.day-card-body');
                    body.style.display = body.style.display === 'none' ? 'block' : 'none';
                });

                // Start day button
                card.querySelector('.btn-start-day').addEventListener('click', (e) => {
                    e.stopPropagation();
                    WorkoutPage.startWorkout(dayKey);
                    AppNavigation.switchPage('workout');
                });

                container.appendChild(card);
            });

            // Nav buttons
            const prevBtn = document.getElementById('btnPrevWeek');
            const nextBtn = document.getElementById('btnNextWeek');
            if (prevBtn) prevBtn.onclick = () => { this.currentWeekOffset--; this.render(); };
            if (nextBtn) nextBtn.onclick = () => { this.currentWeekOffset++; this.render(); };

            refreshIcons();
        }
    };

    // =========================================================================
    // 4. PAGE 2: WORKOUT — LIVE PERFORMANCE COMPARISON CONTROLLER
    // =========================================================================
    const WorkoutPage = {
        init() {
            // Restore active session if exists
            const saved = loadStorage(STORAGE_KEYS.ACTIVE_SESSION, null);
            if (saved && saved.exercises) {
                activeWorkoutSession = saved;
                stopwatchSeconds = saved.elapsedSeconds || 0;
            } else {
                this.startWorkout(getTodayDayId(), false);
            }

            this.initStopwatch();
            this.renderWorkout();
        },

        startWorkout(dayId, startTimer = true) {
            const p = BASELINE_PROGRAM[dayId] || BASELINE_PROGRAM.tuesday;

            // Build exercises with previous performance & today's targets
            const exercises = p.exercises.map(ex => {
                const metrics = PerformanceEngine.getExerciseMetrics(ex, dayId);
                const isTimed = ex.type === 'timed';
                const sets = [];

                for (let i = 0; i < ex.sets; i++) {
                    const targetVal = metrics.todayTarget[i] || ex.targetReps || ex.targetDuration || 10;
                    sets.push({
                        setNumber: i + 1,
                        targetReps: isTimed ? null : targetVal,
                        targetDuration: isTimed ? targetVal : null,
                        actualReps: isTimed ? null : targetVal, // pre-fill as editable suggestion
                        actualDuration: isTimed ? targetVal : null,
                        weight: ex.defaultWeight || 0,
                        assistance: ex.defaultAssistance || 'Medium Band',
                        rir: 2,
                        technique: 'clean',
                        notes: '',
                        done: false // explicitly false until user taps confirm!
                    });
                }

                return {
                    id: ex.id,
                    name: ex.name,
                    type: ex.type,
                    category: ex.category,
                    note: ex.note,
                    prescribedText: `${ex.sets} × ${isTimed ? `${ex.targetDuration}s` : ex.targetReps}`,
                    lastSummaryText: metrics.lastSummaryText,
                    lastPerformance: metrics.lastPerformance,
                    todayTargetText: metrics.todayTargetText,
                    todayTargetArray: metrics.todayTarget,
                    reason: metrics.reason,
                    sets: sets
                };
            });

            activeWorkoutSession = {
                id: `session-${Date.now()}`,
                dayId: dayId,
                title: p.title,
                date: getTodayKey(),
                timestamp: Date.now(),
                exercises: exercises,
                elapsedSeconds: 0
            };

            stopwatchSeconds = 0;
            this.save();
            this.renderWorkout();
            if (startTimer) this.startStopwatch();
        },

        save() {
            if (activeWorkoutSession) {
                activeWorkoutSession.elapsedSeconds = stopwatchSeconds;
                saveStorage(STORAGE_KEYS.ACTIVE_SESSION, activeWorkoutSession);
            } else {
                localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
            }
        },

        renderWorkout() {
            if (!activeWorkoutSession) return;

            // Bar headers
            document.getElementById('workoutCurrentTitle').textContent = `${BASELINE_PROGRAM[activeWorkoutSession.dayId].dayName} · ${activeWorkoutSession.title}`;

            const totalSets = activeWorkoutSession.exercises.reduce((sum, e) => sum + e.sets.length, 0);
            const doneSets = activeWorkoutSession.exercises.reduce((sum, e) => sum + e.sets.filter(s => s.done).length, 0);
            document.getElementById('workoutSubInfo').textContent = `${doneSets}/${totalSets} sets completed`;

            const container = document.getElementById('liveExercisesContainer');
            if (!container) return;
            container.innerHTML = '';

            activeWorkoutSession.exercises.forEach((ex, exIdx) => {
                const card = document.createElement('div');
                card.className = 'live-exercise-card';

                const isTimed = ex.type === 'timed';

                // Set rows
                let rowsHtml = ex.sets.map((s, sIdx) => {
                    const targetVal = isTimed ? s.targetDuration : s.targetReps;
                    const actualVal = isTimed ? s.actualDuration : s.actualReps;

                    // Color code indicator:
                    // RED: actual < target
                    // NEUTRAL: actual == target
                    // GREEN: actual > target
                    let diffBadgeHtml = '';
                    if (actualVal < targetVal) {
                        const diff = actualVal - targetVal;
                        diffBadgeHtml = `<span class="perf-badge red" id="badge-${exIdx}-${sIdx}">${actualVal} (${diff})</span>`;
                    } else if (actualVal === targetVal) {
                        diffBadgeHtml = `<span class="perf-badge neutral" id="badge-${exIdx}-${sIdx}">${actualVal} (Target)</span>`;
                    } else {
                        const diff = actualVal - targetVal;
                        diffBadgeHtml = `<span class="perf-badge green" id="badge-${exIdx}-${sIdx}">${actualVal} (+${diff})</span>`;
                    }

                    return `
                        <div class="set-row-item ${s.done ? 'done' : ''}" data-ex="${exIdx}" data-set="${sIdx}">
                            <div class="set-meta-col">
                                <span class="set-index-label">Set ${s.setNumber}</span>
                                <span class="set-target-hint">Aim: ${targetVal}${isTimed ? 's' : ''}</span>
                            </div>

                            <div class="set-stepper-wrap">
                                <button type="button" class="btn-step-mini btn-minus" aria-label="Decrease">−</button>
                                <input type="number" class="set-input-num input-val" value="${actualVal}" min="0">
                                <button type="button" class="btn-step-mini btn-plus" aria-label="Increase">+</button>
                            </div>

                            <div class="diff-badge-wrap">${diffBadgeHtml}</div>

                            <button type="button" class="btn-confirm-check ${s.done ? 'confirmed' : ''}" title="${s.done ? 'Marked complete' : 'Confirm set'}">
                                <i data-lucide="${s.done ? 'check' : 'circle'}" style="width: 16px; height: 16px;"></i>
                            </button>
                        </div>
                    `;
                }).join('');

                card.innerHTML = `
                    <div class="ex-card-header">
                        <div class="ex-card-title-group">
                            <span class="ex-name-heading">${escapeHtml(ex.name)}</span>
                            <span class="ex-prescribed-pill">${ex.prescribedText}</span>
                        </div>
                    </div>

                    <!-- THREE-LINE LIVE PERFORMANCE COMPARISON -->
                    <div class="perf-comparison-box">
                        <div class="perf-col">
                            <span class="perf-label">Last Performance</span>
                            <span class="perf-val">${escapeHtml(ex.lastSummaryText)}</span>
                        </div>
                        <div class="perf-col">
                            <span class="perf-label">Today's Target</span>
                            <span class="perf-val target">${escapeHtml(ex.todayTargetText)}</span>
                        </div>
                    </div>

                    <!-- SETS ROWS -->
                    <div class="sets-rows-list">
                        ${rowsHtml}
                    </div>
                `;

                // Hook stepper and confirm buttons
                card.querySelectorAll('.set-row-item').forEach(row => {
                    const sIdx = parseInt(row.dataset.set, 10);
                    const setObj = ex.sets[sIdx];
                    const input = row.querySelector('.input-val');
                    const minusBtn = row.querySelector('.btn-minus');
                    const plusBtn = row.querySelector('.btn-plus');
                    const confirmBtn = row.querySelector('.btn-confirm-check');
                    const badgeWrap = row.querySelector('.diff-badge-wrap');

                    const updateRowFeedback = (val) => {
                        const target = isTimed ? setObj.targetDuration : setObj.targetReps;
                        if (isTimed) setObj.actualDuration = val;
                        else setObj.actualReps = val;

                        let badgeHtml = '';
                        if (val < target) {
                            badgeHtml = `<span class="perf-badge red">${val} (${val - target})</span>`;
                        } else if (val === target) {
                            badgeHtml = `<span class="perf-badge neutral">${val} (Target)</span>`;
                        } else {
                            badgeHtml = `<span class="perf-badge green">${val} (+${val - target})</span>`;
                        }
                        badgeWrap.innerHTML = badgeHtml;
                        WorkoutPage.save();
                    };

                    minusBtn.onclick = () => {
                        let cur = parseInt(input.value, 10) || 0;
                        const step = isTimed ? 5 : 1;
                        cur = Math.max(0, cur - step);
                        input.value = cur;
                        updateRowFeedback(cur);
                    };

                    plusBtn.onclick = () => {
                        let cur = parseInt(input.value, 10) || 0;
                        const step = isTimed ? 5 : 1;
                        cur += step;
                        input.value = cur;
                        updateRowFeedback(cur);
                    };

                    input.oninput = () => {
                        const val = Math.max(0, parseInt(input.value, 10) || 0);
                        updateRowFeedback(val);
                    };

                    confirmBtn.onclick = () => {
                        setObj.done = !setObj.done;
                        row.classList.toggle('done', setObj.done);
                        confirmBtn.classList.toggle('confirmed', setObj.done);
                        confirmBtn.innerHTML = `<i data-lucide="${setObj.done ? 'check' : 'circle'}" style="width: 16px; height: 16px;"></i>`;
                        refreshIcons();
                        WorkoutPage.save();

                        if (setObj.done) {
                            playDing();
                            // Trigger persistent rest timer automatically!
                            RestTimerEngine.start();
                        }

                        // Update top sub-info
                        const totalS = activeWorkoutSession.exercises.reduce((sum, e) => sum + e.sets.length, 0);
                        const doneS = activeWorkoutSession.exercises.reduce((sum, e) => sum + e.sets.filter(s => s.done).length, 0);
                        document.getElementById('workoutSubInfo').textContent = `${doneS}/${totalS} sets completed`;
                    };
                });

                container.appendChild(card);
            });

            // Finish workout button
            const finishBtn = document.getElementById('btnFinishWorkout');
            if (finishBtn) finishBtn.onclick = () => this.finishWorkout();

            refreshIcons();
        },

        initStopwatch() {
            const display = document.getElementById('stopwatchClockDisplay');
            if (display) display.textContent = formatTime(stopwatchSeconds);
        },

        startStopwatch() {
            if (isStopwatchRunning) return;
            const display = document.getElementById('stopwatchClockDisplay');
            isStopwatchRunning = true;
            stopwatchInterval = setInterval(() => {
                stopwatchSeconds++;
                if (display) display.textContent = formatTime(stopwatchSeconds);
            }, 1000);
        },

        finishWorkout() {
            if (!activeWorkoutSession) return;

            let totalCompletedSets = 0;
            let totalVolumeReps = 0;

            activeWorkoutSession.exercises.forEach(ex => {
                ex.sets.forEach(s => {
                    if (s.done) {
                        totalCompletedSets++;
                        totalVolumeReps += (s.actualReps || s.actualDuration || 0);
                    }
                });
            });

            if (totalCompletedSets === 0) {
                if (!confirm('No completed sets logged. Finish anyway?')) return;
            }

            // Save recommendations for next time
            const savedTargets = loadStorage(STORAGE_KEYS.TARGETS, {});
            activeWorkoutSession.exercises.forEach(ex => {
                const nextRec = PerformanceEngine.computeNextRecommendation(ex);
                savedTargets[ex.name] = nextRec;
            });
            saveStorage(STORAGE_KEYS.TARGETS, savedTargets);

            const record = {
                id: activeWorkoutSession.id,
                dayId: activeWorkoutSession.dayId,
                dayTitle: activeWorkoutSession.title,
                date: getTodayKey(),
                timestamp: Date.now(),
                durationSeconds: stopwatchSeconds,
                totalSets: totalCompletedSets,
                totalReps: totalVolumeReps,
                exercises: activeWorkoutSession.exercises
            };

            const history = loadStorage(STORAGE_KEYS.HISTORY, []);
            history.unshift(record);
            saveStorage(STORAGE_KEYS.HISTORY, history);

            // Clear active workout
            localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
            activeWorkoutSession = null;
            stopwatchSeconds = 0;
            clearInterval(stopwatchInterval);
            isStopwatchRunning = false;

            playFanfare();
            alert(`🎉 Workout Logged!\n\n${record.dayTitle}\n${totalCompletedSets} sets confirmed (${totalVolumeReps} reps)\n\nNext workout targets have been updated!`);

            WeeklyProgramPage.render();
            HistoryProgressPage.render();
            AppNavigation.switchPage('history');
        }
    };

    // =========================================================================
    // 5. DRIFT-PROOF PERSISTENT REST TIMER (Timestamp-Based)
    // =========================================================================
    const RestTimerEngine = {
        init() {
            const presets = document.querySelectorAll('.btn-rest-chip');
            presets.forEach(btn => {
                btn.onclick = () => {
                    presets.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    restConfiguredSeconds = parseInt(btn.dataset.seconds, 10);
                    if (isRestRunning) this.start();
                    else this.renderClock(restConfiguredSeconds);
                };
            });

            const pauseBtn = document.getElementById('btnRestPause');
            const skipBtn = document.getElementById('btnRestSkip');

            if (pauseBtn) {
                pauseBtn.onclick = () => {
                    if (isRestRunning) this.pause();
                    else this.resume();
                };
            }

            if (skipBtn) {
                skipBtn.onclick = () => this.stop();
            }

            this.renderClock(restConfiguredSeconds);
        },

        start() {
            restTargetTimestamp = Date.now() + (restConfiguredSeconds * 1000);
            isRestRunning = true;
            this.setPauseBtnIcon(false);

            if (restTimerInterval) clearInterval(restTimerInterval);
            restTimerInterval = setInterval(() => this.tick(), 250);
            this.tick();

            const dock = document.getElementById('compactRestDock');
            if (dock) dock.style.display = 'flex';
        },

        tick() {
            if (!isRestRunning || !restTargetTimestamp) return;
            const diffMs = restTargetTimestamp - Date.now();
            const secsLeft = Math.max(0, Math.ceil(diffMs / 1000));
            this.renderClock(secsLeft);

            if (secsLeft <= 3 && secsLeft > 0) {
                playTone(440, 'sine', 0.08, 0.1);
            }

            if (secsLeft === 0) {
                this.stop();
                playRestDoneAlert();
            }
        },

        pause() {
            if (!isRestRunning) return;
            isRestRunning = false;
            clearInterval(restTimerInterval);
            const remaining = Math.max(0, Math.ceil((restTargetTimestamp - Date.now()) / 1000));
            restConfiguredSeconds = remaining;
            this.setPauseBtnIcon(true);
        },

        resume() {
            this.start();
        },

        stop() {
            isRestRunning = false;
            if (restTimerInterval) clearInterval(restTimerInterval);
            this.renderClock(restConfiguredSeconds);
            this.setPauseBtnIcon(true);
            const dock = document.getElementById('compactRestDock');
            if (dock) dock.style.display = 'none';
        },

        renderClock(secs) {
            const clock = document.getElementById('restClockNum');
            if (clock) clock.textContent = formatTime(secs);
        },

        setPauseBtnIcon(isPaused) {
            const btn = document.getElementById('btnRestPause');
            if (btn) {
                btn.innerHTML = `<i data-lucide="${isPaused ? 'play' : 'pause'}" style="width: 14px; height: 14px;"></i>`;
                refreshIcons();
            }
        }
    };

    // =========================================================================
    // 6. PAGE 3: HISTORY & PROGRESS CONTROLLER
    // =========================================================================
    const HistoryProgressPage = {
        currentMode: 'date', // 'date' or 'exercise'
        selectedExercise: 'Push-ups',

        init() {
            const btnDate = document.getElementById('btnModeDate');
            const btnEx = document.getElementById('btnModeExercise');

            if (btnDate && btnEx) {
                btnDate.onclick = () => {
                    this.currentMode = 'date';
                    btnDate.classList.add('active');
                    btnEx.classList.remove('active');
                    document.getElementById('modeDateSection').style.display = 'block';
                    document.getElementById('modeExerciseSection').style.display = 'none';
                    this.renderDateHistory();
                };

                btnEx.onclick = () => {
                    this.currentMode = 'exercise';
                    btnEx.classList.add('active');
                    btnDate.classList.remove('active');
                    document.getElementById('modeDateSection').style.display = 'none';
                    document.getElementById('modeExerciseSection').style.display = 'block';
                    this.renderExerciseHistory();
                };
            }

            const exSelect = document.getElementById('exerciseHistorySelect');
            if (exSelect) {
                // Populate all unique exercises from weekly program
                const exerciseNames = new Set();
                Object.values(DEFAULT_ROUTINE).forEach(day => {
                    if (day.type !== 'rest_mobility' && day.type !== 'rest_stretch') {
                        (day.exercises || []).forEach(ex => {
                            if (ex.name && !ex.name.toLowerCase().includes('warm-up')) {
                                exerciseNames.add(ex.name);
                            }
                        });
                    }
                });

                if (exerciseNames.size > 0) {
                    const currentVal = exSelect.value || this.selectedExercise;
                    exSelect.innerHTML = Array.from(exerciseNames).map(name => `
                        <option value="${escapeHtml(name)}" ${name === currentVal ? 'selected' : ''}>${escapeHtml(name)}</option>
                    `).join('');
                    if (!exerciseNames.has(this.selectedExercise)) {
                        this.selectedExercise = Array.from(exerciseNames)[0];
                    }
                }

                exSelect.onchange = () => {
                    this.selectedExercise = exSelect.value;
                    this.renderExerciseHistory();
                };
            }

            this.render();
        },

        render() {
            if (this.currentMode === 'date') this.renderDateHistory();
            else this.renderExerciseHistory();
        },

        renderDateHistory() {
            const container = document.getElementById('historySessionsList');
            if (!container) return;
            container.innerHTML = '';

            const history = loadStorage(STORAGE_KEYS.HISTORY, []);

            if (history.length === 0) {
                container.innerHTML = `
                    <div class="history-empty-state">
                        <div class="empty-icon-wrap">
                            <i data-lucide="dumbbell" style="width: 24px; height: 24px; stroke-width: 1.5; color: var(--accent);"></i>
                        </div>
                        <h3 style="margin: 0 0 6px 0; font-size: 0.95rem; font-weight: 700; color: var(--text);">No Workout Sessions Recorded Yet</h3>
                        <p style="margin: 0 auto 16px auto; font-size: 0.82rem; color: var(--text-muted); max-width: 320px; line-height: 1.45;">
                            Start your first workout today. Your logged sets, reps, and progression will appear here.
                        </p>
                        <button type="button" class="btn btn-primary" id="btnStartFirstWorkout" style="padding: 8px 18px; font-size: 0.82rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                            <i data-lucide="play" style="width: 14px; height: 14px;"></i> Start My First Workout
                        </button>
                    </div>
                `;
                const startBtn = document.getElementById('btnStartFirstWorkout');
                if (startBtn) {
                    startBtn.onclick = () => {
                        const todayDayId = getTodayDayId();
                        WorkoutPage.startWorkout(todayDayId);
                        AppNavigation.switchPage('workout');
                    };
                }
                if (window.lucide) window.lucide.createIcons();
                return;
            }

            history.forEach((session, idx) => {
                const item = document.createElement('div');
                item.className = 'session-history-item';

                let exDetailsHtml = (session.exercises || []).map(ex => {
                    const setsStr = (ex.sets || []).map(s => s.actualReps !== null ? s.actualReps : s.actualDuration).join(' / ');
                    return `<div><strong>${escapeHtml(ex.name)}:</strong> ${setsStr} ${ex.notes ? `<small style="color: var(--accent);">(${escapeHtml(ex.notes)})</small>` : ''}</div>`;
                }).join('');

                item.innerHTML = `
                    <div class="session-item-header">
                        <span class="session-date-col">${session.date}</span>
                        <span class="session-name-col">${escapeHtml(session.dayTitle)}</span>
                        <span class="session-stats-col">${session.totalSets || 0} sets · ${session.totalReps || 0} reps</span>
                    </div>
                    <div class="session-item-details" style="display: none;">
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            ${exDetailsHtml}
                        </div>
                    </div>
                `;

                item.querySelector('.session-item-header').onclick = () => {
                    const d = item.querySelector('.session-item-details');
                    d.style.display = d.style.display === 'none' ? 'block' : 'none';
                };

                container.appendChild(item);
            });
        },

        renderExerciseHistory() {
            const exName = this.selectedExercise;
            const history = loadStorage(STORAGE_KEYS.HISTORY, []);
            const compBox = document.getElementById('progDiffBox');
            const chartSvg = document.getElementById('progChartSvg');

            // Empty state if user has never logged any workout
            if (history.length === 0) {
                if (compBox) compBox.innerHTML = '';
                if (chartSvg) {
                    chartSvg.innerHTML = `
                        <div class="history-empty-state" style="border: none; background: transparent; padding: 20px 0;">
                            <div class="empty-icon-wrap">
                                <i data-lucide="bar-chart-2" style="width: 24px; height: 24px; stroke-width: 1.5; color: var(--accent);"></i>
                            </div>
                            <h3 style="margin: 0 0 6px 0; font-size: 0.95rem; font-weight: 700; color: var(--text);">No Training Data Recorded Yet</h3>
                            <p style="margin: 0 auto 16px auto; font-size: 0.82rem; color: var(--text-muted); max-width: 320px; line-height: 1.45;">
                                Complete your first workout to see performance charts, personal records, and progression for ${escapeHtml(exName)}.
                            </p>
                            <button type="button" class="btn btn-primary" id="btnStartFirstWorkoutEx" style="padding: 8px 18px; font-size: 0.82rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                                <i data-lucide="play" style="width: 14px; height: 14px;"></i> Start My First Workout
                            </button>
                        </div>
                    `;
                    const startBtn = document.getElementById('btnStartFirstWorkoutEx');
                    if (startBtn) {
                        startBtn.onclick = () => {
                            const todayDayId = getTodayDayId();
                            WorkoutPage.startWorkout(todayDayId);
                            AppNavigation.switchPage('workout');
                        };
                    }
                    if (window.lucide) window.lucide.createIcons();
                }
                return;
            }

            // Filter all sessions containing this exercise
            const matchingSessions = history.filter(s => s.exercises && s.exercises.some(e => e.name === exName));

            // Clean state if this specific exercise has not been performed yet
            if (matchingSessions.length === 0) {
                if (compBox) {
                    compBox.innerHTML = `
                        <div style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                            <span style="font-weight: 600; color: var(--text);">${escapeHtml(exName)}</span>
                            <span style="font-size: 0.76rem; color: var(--text-muted);">0 sessions logged</span>
                        </div>
                    `;
                }
                if (chartSvg) {
                    chartSvg.innerHTML = `
                        <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.82rem; text-align: center; padding: 20px;">
                            <i data-lucide="inbox" style="width: 24px; height: 24px; stroke-width: 1.5; color: var(--text-muted); margin-bottom: 8px;"></i>
                            <div style="font-weight: 600; color: var(--text);">No recorded sessions for ${escapeHtml(exName)} yet</div>
                            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">Log a workout containing this exercise to view personal records and performance charts.</div>
                        </div>
                    `;
                    if (window.lucide) window.lucide.createIcons();
                }
                return;
            }

            // Calculate All-Time Personal Record (PR) and unit
            const allSets = matchingSessions.flatMap(s => s.exercises.find(e => e.name === exName)?.sets || []);
            const isTimed = allSets.some(s => s.actualDuration && !s.actualReps);
            const unit = isTimed ? 's' : ' reps';
            const prValue = allSets.length ? Math.max(...allSets.map(s => s.actualReps !== null && s.actualReps !== undefined ? s.actualReps : (s.actualDuration || 0))) : 0;

            const latestSession = matchingSessions[0];
            const latestEx = latestSession.exercises.find(e => e.name === exName);
            const latestSetsStr = (latestEx.sets || []).map(s => s.actualReps !== null && s.actualReps !== undefined ? s.actualReps : (s.actualDuration || 0)).join(' / ');
            const latestTotal = (latestEx.sets || []).reduce((sum, s) => sum + (s.actualReps !== null && s.actualReps !== undefined ? s.actualReps : (s.actualDuration || 0)), 0);
            const latestBest = Math.max(...(latestEx.sets || []).map(s => s.actualReps !== null && s.actualReps !== undefined ? s.actualReps : (s.actualDuration || 0)), 0);

            // Performance & PR Comparison Box
            if (compBox) {
                if (matchingSessions.length === 1) {
                    compBox.innerHTML = `
                        <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-weight: 700; font-size: 0.88rem; color: var(--text);">${escapeHtml(exName)}</span>
                                    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: var(--radius-full); font-size: 0.72rem; font-weight: 700; color: var(--accent);">
                                        🏆 PR: ${prValue}${unit}
                                    </span>
                                </div>
                                <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">1 session logged</span>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem;">
                                <div>
                                    <span style="color: var(--text-muted);">Session (${latestSession.date}):</span> 
                                    <strong>${latestSetsStr}</strong>
                                </div>
                                <span style="font-size: 0.74rem; color: var(--text-muted);">Complete another session to track deltas</span>
                            </div>
                        </div>
                    `;
                } else {
                    const prevSession = matchingSessions[1];
                    const prevEx = prevSession.exercises.find(e => e.name === exName);
                    const prevSetsStr = (prevEx.sets || []).map(s => s.actualReps !== null && s.actualReps !== undefined ? s.actualReps : (s.actualDuration || 0)).join(' / ');
                    const prevTotal = (prevEx.sets || []).reduce((sum, s) => sum + (s.actualReps !== null && s.actualReps !== undefined ? s.actualReps : (s.actualDuration || 0)), 0);
                    const prevBest = Math.max(...(prevEx.sets || []).map(s => s.actualReps !== null && s.actualReps !== undefined ? s.actualReps : (s.actualDuration || 0)), 0);

                    const diffTotal = latestTotal - prevTotal;
                    const diffBest = latestBest - prevBest;

                    compBox.innerHTML = `
                        <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-weight: 700; font-size: 0.88rem; color: var(--text);">${escapeHtml(exName)}</span>
                                    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: var(--radius-full); font-size: 0.72rem; font-weight: 700; color: var(--accent);">
                                        🏆 PR: ${prValue}${unit}
                                    </span>
                                </div>
                                <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${matchingSessions.length} sessions logged</span>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; font-size: 0.8rem;">
                                <div>
                                    <span style="color: var(--text-muted);">Latest (${latestSession.date}):</span> 
                                    <strong>${latestSetsStr}</strong>
                                    <span style="color: var(--text-muted); margin-left: 8px;">Prev (${prevSession.date}):</span>
                                    <span style="color: var(--text-secondary);">${prevSetsStr}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    ${diffTotal >= 0 ? `<span style="color: var(--perf-green); font-weight: 600;">+${diffTotal} total</span>` : `<span style="color: var(--perf-red); font-weight: 600;">${diffTotal} total</span>`}
                                    <span>·</span>
                                    ${diffBest >= 0 ? `<span style="color: var(--perf-green); font-weight: 600;">+${diffBest} best set</span>` : `<span style="color: var(--perf-red); font-weight: 600;">${diffBest} best set</span>`}
                                </div>
                            </div>
                        </div>
                    `;
                }
            }

            // Progression SVG Chart
            if (chartSvg) {
                const points = [];
                matchingSessions.slice().reverse().forEach(s => {
                    const ex = s.exercises.find(e => e.name === exName);
                    if (ex && ex.sets) {
                        const best = Math.max(...ex.sets.map(set => set.actualReps !== null && set.actualReps !== undefined ? set.actualReps : (set.actualDuration || 0)));
                        if (best > 0) points.push({ date: s.date, val: best });
                    }
                });

                if (points.length < 2) {
                    chartSvg.innerHTML = `
                        <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.8rem; gap: 4px; padding: 20px;">
                            <span>1 session recorded (${points[0] ? `${points[0].date}: ${points[0].val}${unit} best set` : 'recent'}).</span>
                            <span style="font-size: 0.74rem;">Complete 1 more session of ${escapeHtml(exName)} to generate the progression trendline.</span>
                        </div>
                    `;
                } else {
                    const w = 620;
                    const h = 180;
                    const padX = 40;
                    const padY = 24;

                    const max = Math.max(...points.map(p => p.val)) + 1;
                    const min = Math.max(0, Math.min(...points.map(p => p.val)) - 1);

                    const getX = (idx) => padX + (idx / (points.length - 1)) * (w - padX * 2);
                    const getY = (v) => h - padY - ((v - min) / (max - min || 1)) * (h - padY * 2);

                    let pathD = '';
                    let dots = '';
                    points.forEach((p, idx) => {
                        const x = getX(idx);
                        const y = getY(p.val);
                        if (idx === 0) pathD += `M ${x} ${y}`;
                        else pathD += ` L ${x} ${y}`;
                        dots += `<circle cx="${x}" cy="${y}" r="4" fill="var(--accent)" />
                                 <text x="${x}" y="${y - 8}" font-size="9" font-weight="600" fill="var(--text-secondary)" text-anchor="middle" font-family="var(--font-mono)">${p.val}</text>
                                 <text x="${x}" y="${h - 6}" font-size="8" fill="var(--text-muted)" text-anchor="middle" font-family="var(--font-mono)">${p.date.slice(5)}</text>`;
                    });

                    chartSvg.innerHTML = `
                        <svg viewBox="0 0 ${w} ${h}">
                            <line x1="${padX}" y1="${getY(min)}" x2="${w - padX}" y2="${getY(min)}" stroke="var(--border-subtle)" stroke-dasharray="3,3" />
                            <line x1="${padX}" y1="${getY(max)}" x2="${w - padX}" y2="${getY(max)}" stroke="var(--border-subtle)" stroke-dasharray="3,3" />
                            <path d="${pathD}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" />
                            ${dots}
                        </svg>
                    `;
                }
            }
        }
    };

    // =========================================================================
    // 7. APP NAVIGATION (Exact 3 Main Pages)
    // =========================================================================
    const AppNavigation = {
        init() {
            const tabs = document.querySelectorAll('.nav-tab');
            tabs.forEach(tab => {
                tab.onclick = () => {
                    this.switchPage(tab.dataset.page);
                };
            });
        },

        switchPage(pageId) {
            document.querySelectorAll('.nav-tab').forEach(t => {
                t.classList.toggle('active', t.dataset.page === pageId);
            });
            document.querySelectorAll('.page-view').forEach(view => {
                view.classList.toggle('active', view.id === `page-${pageId}`);
            });

            if (pageId === 'program') WeeklyProgramPage.render();
            if (pageId === 'workout') WorkoutPage.renderWorkout();
            if (pageId === 'history') HistoryProgressPage.render();

            refreshIcons();
        }
    };

    function initThemeToggle() {
        const btn = document.getElementById('themeToggleBtn');
        const saved = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
        document.documentElement.setAttribute('data-theme', saved);

        if (btn) {
            btn.onclick = () => {
                const cur = document.documentElement.getAttribute('data-theme') || 'dark';
                const next = cur === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem(STORAGE_KEYS.THEME, next);
            };
        }
    }

    function initSoundToggle() {
        soundEnabled = loadStorage(STORAGE_KEYS.SOUND, true);
        const btn = document.getElementById('soundToggleBtn');
        const update = () => {
            if (!btn) return;
            btn.style.color = soundEnabled ? 'var(--accent)' : 'var(--text-muted)';
            btn.title = soundEnabled ? 'Audio alerts active' : 'Audio alerts muted';
        };
        update();

        if (btn) {
            btn.onclick = () => {
                soundEnabled = !soundEnabled;
                saveStorage(STORAGE_KEYS.SOUND, soundEnabled);
                update();
                if (soundEnabled) playDing();
            };
        }
    }

    // App Initialization
    document.addEventListener('DOMContentLoaded', () => {
        initThemeToggle();
        initSoundToggle();
        AppNavigation.init();

        WeeklyProgramPage.render();
        WorkoutPage.init();
        RestTimerEngine.init();
        HistoryProgressPage.init();

        refreshIcons();
    });

})();
