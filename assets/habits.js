(() => {
    const storageKey = 'dashboard_habits';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let habits = [];

    try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (Array.isArray(saved)) habits = saved;
    } catch {}

    const section = document.createElement('section');
    section.className = 'habits-section';
    section.setAttribute('aria-labelledby', 'habitsTitle');
    section.innerHTML = `
        <div class="habits-heading">
            <div class="habits-title-wrap">
                <h2 id="habitsTitle"><i data-lucide="flame" class="icon habits-title-icon"></i> Habits</h2>
                <span class="habits-summary-badge" id="habitsSummaryBadge">0 done today</span>
            </div>
            <button type="button" id="addHabit" class="habit-add-btn">
                <i data-lucide="plus" class="icon"></i> <span>Add habit</span>
            </button>
        </div>
        <div id="habitList" class="habit-list"></div>
        <div id="habitArchivedContainer" class="habit-archived-container" hidden>
            <details class="habit-archived-details">
                <summary class="habit-archived-summary">Archived habits (<span id="archivedHabitsCount">0</span>)</summary>
                <div id="habitArchivedList" class="habit-archived-list"></div>
            </details>
        </div>
    `;

    const objectivesSection = document.querySelector('.objectives-section');
    if (objectivesSection) {
        objectivesSection.after(section);
    } else {
        document.querySelector('.container')?.appendChild(section);
    }

    const scheduled = (habit, date) => {
        if (date < habit.start) return false;
        const day = new Date(`${date}T12:00:00`).getDay();
        return Array.isArray(habit.days) && habit.days.includes(day);
    };

    const done = (habit, date) => (habit.history?.[date] || 0) >= (habit.target || 1);

    function streak(habit, today) {
        let count = 0;
        let date = today;
        if (scheduled(habit, today) && !done(habit, today)) {
            date = offsetDateKey(today, -1);
        }
        for (; date >= habit.start; date = offsetDateKey(date, -1)) {
            if (!scheduled(habit, date)) continue;
            if (done(habit, date)) count++;
            else break;
        }
        return count;
    }

    function persist() {
        localStorage.setItem(storageKey, JSON.stringify(habits));
        render();
    }

    function showHabitToast(message) {
        if (typeof showGoalToast === 'function') {
            showGoalToast(message);
            return;
        }
        let container = document.getElementById('goalToastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'goalToastContainer';
            container.className = 'goal-toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'goal-toast';
        toast.innerHTML = `<i data-lucide="check" class="icon"></i><span>${message}</span>`;
        container.appendChild(toast);
        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons({ root: toast });
        setTimeout(() => {
            toast.classList.add('toast-fade');
            setTimeout(() => toast.remove(), 250);
        }, 2200);
    }

    // --- Floating Modal for Adding / Editing Habits ---
    function openHabitModal(habit = null) {
        const existing = document.getElementById('habitModalOverlay');
        if (existing) existing.remove();

        const isEditing = Boolean(habit);
        let selectedKind = habit?.kind || 'check';
        let selectedDays = habit ? [...habit.days] : [0, 1, 2, 3, 4, 5, 6];

        const overlay = document.createElement('div');
        overlay.id = 'habitModalOverlay';
        overlay.className = 'habit-modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        const card = document.createElement('div');
        card.className = 'habit-modal-card';

        // Header
        const header = document.createElement('div');
        header.className = 'habit-modal-header';
        header.innerHTML = `
            <div class="habit-modal-title">
                <i data-lucide="${isEditing ? 'pencil' : 'sparkles'}" class="icon"></i>
                <span>${isEditing ? 'Edit Habit' : 'New Habit'}</span>
            </div>
            <button type="button" class="habit-modal-close" aria-label="Close dialog">&times;</button>
        `;

        // Form
        const form = document.createElement('form');
        form.className = 'habit-modal-form';

        // 1. Name
        const nameGroup = document.createElement('div');
        nameGroup.className = 'habit-form-group';
        nameGroup.innerHTML = `
            <label class="habit-form-label" for="habitModalName">Habit Name</label>
            <input type="text" id="habitModalName" class="habit-modal-input" placeholder="e.g. Read 20 mins, 100 pushups, Quran..." required maxlength="120" value="${habit ? cleanText(habit.name) : ''}">
        `;

        // 2. Type Selector
        const typeGroup = document.createElement('div');
        typeGroup.className = 'habit-form-group';
        typeGroup.innerHTML = `
            <label class="habit-form-label">Tracking Type</label>
            <div class="habit-type-tabs">
                <button type="button" class="habit-type-tab${selectedKind === 'check' ? ' active' : ''}" data-type="check">
                    <i data-lucide="check-circle-2" class="icon"></i> <span>Yes / No (Checkbox)</span>
                </button>
                <button type="button" class="habit-type-tab${selectedKind === 'quantity' ? ' active' : ''}" data-type="quantity">
                    <i data-lucide="hash" class="icon"></i> <span>Numeric Target</span>
                </button>
            </div>
            <div class="habit-quantity-wrap" ${selectedKind !== 'quantity' ? 'hidden' : ''}>
                <div class="habit-qty-field">
                    <label class="habit-sublabel">Daily Target</label>
                    <input type="number" id="habitModalTarget" class="habit-modal-input" min="1" max="1000000" step="1" value="${habit?.target || 10}">
                </div>
                <div class="habit-qty-field">
                    <label class="habit-sublabel">Unit</label>
                    <input type="text" id="habitModalUnit" class="habit-modal-input" placeholder="e.g. pages, pushups, mins" maxlength="30" value="${habit ? cleanText(habit.unit || '') : ''}">
                </div>
            </div>
        `;

        // Type tab switching
        const typeTabs = typeGroup.querySelectorAll('.habit-type-tab');
        const qtyWrap = typeGroup.querySelector('.habit-quantity-wrap');
        typeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                typeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                selectedKind = tab.dataset.type;
                qtyWrap.hidden = selectedKind !== 'quantity';
            });
        });

        // 3. Schedule (Presets & Weekday Chips)
        const scheduleGroup = document.createElement('div');
        scheduleGroup.className = 'habit-form-group';
        scheduleGroup.innerHTML = `
            <div class="habit-label-row">
                <label class="habit-form-label">Frequency</label>
                <div class="habit-preset-chips">
                    <button type="button" class="habit-preset-chip" data-preset="daily">Every day</button>
                    <button type="button" class="habit-preset-chip" data-preset="weekdays">Weekdays</button>
                    <button type="button" class="habit-preset-chip" data-preset="weekends">Weekends</button>
                </div>
            </div>
            <div class="habit-weekday-picker"></div>
        `;

        const weekdayPicker = scheduleGroup.querySelector('.habit-weekday-picker');
        // Render weekday chips: Mon (1) to Sun (0)
        [1, 2, 3, 4, 5, 6, 0].forEach(dayIdx => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `habit-day-chip${selectedDays.includes(dayIdx) ? ' active' : ''}`;
            btn.dataset.day = dayIdx;
            btn.textContent = dayNames[dayIdx].slice(0, 3);
            btn.addEventListener('click', () => {
                if (selectedDays.includes(dayIdx)) {
                    if (selectedDays.length > 1) {
                        selectedDays = selectedDays.filter(d => d !== dayIdx);
                        btn.classList.remove('active');
                    }
                } else {
                    selectedDays.push(dayIdx);
                    btn.classList.add('active');
                }
            });
            weekdayPicker.appendChild(btn);
        });

        // Preset handlers
        scheduleGroup.querySelectorAll('.habit-preset-chip').forEach(presetBtn => {
            presetBtn.addEventListener('click', () => {
                const preset = presetBtn.dataset.preset;
                if (preset === 'daily') selectedDays = [0, 1, 2, 3, 4, 5, 6];
                else if (preset === 'weekdays') selectedDays = [1, 2, 3, 4, 5];
                else if (preset === 'weekends') selectedDays = [6, 0];

                weekdayPicker.querySelectorAll('.habit-day-chip').forEach(chip => {
                    const d = Number(chip.dataset.day);
                    chip.classList.toggle('active', selectedDays.includes(d));
                });
            });
        });

        // 4. Link to Objective
        const objectiveGroup = document.createElement('div');
        objectiveGroup.className = 'habit-form-group';
        objectiveGroup.innerHTML = `
            <label class="habit-form-label" for="habitModalObjective">Link to Objective <span class="habit-optional">(optional)</span></label>
            <select id="habitModalObjective" class="habit-modal-select">
                <option value="">No linked objective</option>
            </select>
        `;

        const select = objectiveGroup.querySelector('select');
        ['yearly', 'monthly', 'weekly'].forEach(period => {
            const items = typeof hierarchyItems === 'function' ? hierarchyItems(period) : [];
            if (!items.length) return;
            const group = document.createElement('optgroup');
            group.label = period === 'yearly' ? 'Yearly Goals' : period === 'monthly' ? 'Monthly Objectives' : 'Weekly Targets';
            items.forEach(goal => {
                if (showArchivedGoals || !goal.archived) {
                    group.appendChild(new Option(`${goal.text}${goal.archived ? ' (archived)' : ''}`, `${period}:${goal.id}`));
                }
            });
            if (group.children.length) select.appendChild(group);
        });
        if (habit?.objective) select.value = habit.objective;

        // 5. Actions
        const actionsRow = document.createElement('div');
        actionsRow.className = 'habit-modal-actions';
        actionsRow.innerHTML = `
            <button type="button" class="habit-btn-cancel">Cancel</button>
            <button type="submit" class="habit-btn-save"><i data-lucide="check" class="icon"></i> <span>Save Habit</span></button>
        `;

        form.append(nameGroup, typeGroup, scheduleGroup, objectiveGroup, actionsRow);

        function close() {
            overlay.classList.add('closing');
            setTimeout(() => overlay.remove(), 180);
        }

        header.querySelector('.habit-modal-close').addEventListener('click', close);
        actionsRow.querySelector('.habit-btn-cancel').addEventListener('click', close);
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
        overlay.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

        form.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('habitModalName').value.trim();
            if (!name) return;
            if (!selectedDays.length) {
                alert('Please select at least one day for this habit.');
                return;
            }

            const targetVal = selectedKind === 'quantity' ? Number(document.getElementById('habitModalTarget').value) : 1;
            const unitVal = selectedKind === 'quantity' ? document.getElementById('habitModalUnit').value.trim() : '';
            const objVal = document.getElementById('habitModalObjective').value;

            if (isEditing && habit) {
                habit.name = name;
                habit.kind = selectedKind;
                habit.target = targetVal;
                habit.unit = unitVal;
                habit.days = selectedDays;
                habit.objective = objVal;
            } else {
                habits.push({
                    id: (typeof createLocalId === 'function') ? createLocalId() : crypto.randomUUID(),
                    name,
                    days: selectedDays,
                    kind: selectedKind,
                    target: targetVal,
                    unit: unitVal,
                    objective: objVal,
                    archived: false,
                    start: (typeof localDateKey === 'function') ? localDateKey() : new Date().toISOString().slice(0, 10),
                    history: {}
                });
            }

            persist();
            close();
            showHabitToast(isEditing ? `Updated "${name}"` : `Added habit "${name}"`);
        });

        card.append(header, form);
        overlay.appendChild(card);
        document.body.appendChild(overlay);

        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons({ root: overlay });
        requestAnimationFrame(() => document.getElementById('habitModalName')?.focus());
    }

    section.querySelector('#addHabit').addEventListener('click', () => openHabitModal());

    // --- Render Habit Cards ---
    function render() {
        const today = typeof localDateKey === 'function' ? localDateKey() : new Date().toISOString().slice(0, 10);
        const todayDate = new Date(`${today}T12:00:00`);
        const monday = typeof offsetDateKey === 'function'
            ? offsetDateKey(today, -(todayDate.getDay() + 6) % 7)
            : today;

        const list = section.querySelector('#habitList');
        const archivedContainer = section.querySelector('#habitArchivedContainer');
        const archivedList = section.querySelector('#habitArchivedList');
        const archivedCountEl = section.querySelector('#archivedHabitsCount');
        const summaryBadge = section.querySelector('#habitsSummaryBadge');

        list.replaceChildren();
        archivedList.replaceChildren();

        const activeHabits = habits.filter(h => !h.archived);
        const archivedHabits = habits.filter(h => h.archived);

        // Update summary badge
        const scheduledToday = activeHabits.filter(h => scheduled(h, today));
        const doneTodayCount = scheduledToday.filter(h => done(h, today)).length;

        if (summaryBadge) {
            if (scheduledToday.length === 0) {
                summaryBadge.textContent = 'No habits scheduled today';
                summaryBadge.className = 'habits-summary-badge';
            } else if (doneTodayCount === scheduledToday.length) {
                summaryBadge.textContent = `All ${scheduledToday.length} done today! 🎉`;
                summaryBadge.className = 'habits-summary-badge all-done';
            } else {
                summaryBadge.textContent = `${doneTodayCount}/${scheduledToday.length} done today`;
                summaryBadge.className = 'habits-summary-badge';
            }
        }

        if (!activeHabits.length) {
            const empty = document.createElement('div');
            empty.className = 'habit-empty-state';
            empty.innerHTML = `
                <div class="habit-empty-icon"><i data-lucide="sparkles" class="icon"></i></div>
                <p class="habit-empty-text">Build consistency. Add your first habit above!</p>
            `;
            list.appendChild(empty);
        }

        function createHabitCard(habit) {
            const card = document.createElement('div');
            const isDoneToday = done(habit, today);
            const isScheduledToday = scheduled(habit, today);

            card.className = `habit-card${isDoneToday ? ' is-completed-today' : ''}${!isScheduledToday ? ' is-rest-today' : ''}${habit.archived ? ' is-archived' : ''}`;
            card.id = `habit-${habit.id}`;

            // Left Section: Action button + Title & Details
            const leftSection = document.createElement('div');
            leftSection.className = 'habit-left';

            // Completion Button
            const checkBtn = document.createElement('button');
            checkBtn.type = 'button';
            checkBtn.className = `habit-check-btn${isDoneToday ? ' is-done' : ''}${!isScheduledToday ? ' is-rest' : ''}`;
            checkBtn.setAttribute('aria-label', `${isDoneToday ? 'Mark incomplete' : 'Complete'} ${habit.name} today`);

            if (isDoneToday) {
                checkBtn.innerHTML = '<i data-lucide="check" class="icon check-icon"></i>';
                checkBtn.title = 'Completed today! Click to undo';
            } else if (isScheduledToday) {
                checkBtn.innerHTML = '<span class="check-circle-inner"></span>';
                checkBtn.title = 'Click to complete today';
            } else {
                checkBtn.innerHTML = '<span class="rest-badge">Zz</span>';
                checkBtn.title = 'Rest day today. Click if you did it anyway!';
            }

            checkBtn.addEventListener('click', () => {
                if (isDoneToday) {
                    habit.history[today] = 0;
                } else {
                    habit.history[today] = habit.target || 1;
                    showHabitToast(`Great job! Completed "${habit.name}"`);
                }
                persist();
            });

            // Details Container
            const details = document.createElement('div');
            details.className = 'habit-details';

            // Title Row
            const titleRow = document.createElement('div');
            titleRow.className = 'habit-title-row';

            const nameEl = document.createElement('span');
            nameEl.className = 'habit-name';
            nameEl.textContent = habit.name;
            titleRow.appendChild(nameEl);

            // Sub-row: Linked Objective chip & schedule
            const subRow = document.createElement('div');
            subRow.className = 'habit-sub-row';

            // Parent Goal Chip (if linked)
            if (habit.objective) {
                const sep = habit.objective.indexOf(':');
                const period = sep !== -1 ? habit.objective.slice(0, sep) : '';
                const goalId = sep !== -1 ? habit.objective.slice(sep + 1) : habit.objective;
                const goalObj = typeof hierarchyItems === 'function' ? hierarchyItems(period).find(g => g.id === goalId) : null;

                const chip = document.createElement('span');
                chip.className = `habit-objective-chip ${period}`;
                chip.title = goalObj ? `Goal: ${goalObj.text} (Click to view)` : 'Linked objective';
                chip.innerHTML = `
                    <i data-lucide="corner-down-right" class="chip-icon"></i>
                    <span class="chip-label">${goalObj ? cleanText(goalObj.text) : 'Linked Goal'}</span>
                `;

                chip.addEventListener('click', e => {
                    e.stopPropagation();
                    const targetEl = document.getElementById(`objective-${goalId}`);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        targetEl.classList.add('goal-pulse');
                        setTimeout(() => targetEl.classList.remove('goal-pulse'), 1200);
                    }
                });
                subRow.appendChild(chip);
            }

            // Frequency text
            const freqText = document.createElement('span');
            freqText.className = 'habit-freq-text';
            if (habit.days?.length === 7) freqText.textContent = 'Every day';
            else if (habit.days?.length === 5 && !habit.days.includes(0) && !habit.days.includes(6)) freqText.textContent = 'Weekdays';
            else if (!isScheduledToday) freqText.textContent = 'Rest day today';
            else freqText.textContent = `${habit.days?.length || 0} days/week`;

            subRow.appendChild(freqText);

            // Numeric Target inline display if quantity
            if (habit.kind === 'quantity') {
                const qtyWrap = document.createElement('div');
                qtyWrap.className = 'habit-qty-stepper';
                const currentVal = habit.history?.[today] || 0;

                const minusBtn = document.createElement('button');
                minusBtn.type = 'button';
                minusBtn.className = 'qty-btn';
                minusBtn.textContent = '−';
                minusBtn.title = 'Subtract 1';
                minusBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    habit.history[today] = Math.max(0, currentVal - 1);
                    persist();
                });

                const qtyDisplay = document.createElement('span');
                qtyDisplay.className = 'qty-display';
                qtyDisplay.textContent = `${currentVal} / ${habit.target} ${habit.unit || ''}`;

                const plusBtn = document.createElement('button');
                plusBtn.type = 'button';
                plusBtn.className = 'qty-btn';
                plusBtn.textContent = '+';
                plusBtn.title = 'Add 1';
                plusBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    habit.history[today] = currentVal + 1;
                    persist();
                });

                qtyWrap.append(minusBtn, qtyDisplay, plusBtn);
                subRow.appendChild(qtyWrap);
            }

            details.append(titleRow, subRow);
            leftSection.append(checkBtn, details);

            // Middle Section: Interactive Day Bubbles
            const weekSection = document.createElement('div');
            weekSection.className = 'habit-week';

            for (let i = 0; i < 7; i++) {
                const date = typeof offsetDateKey === 'function' ? offsetDateKey(monday, i) : today;
                const isDayScheduled = scheduled(habit, date);
                const isDayDone = done(habit, date);
                const isFuture = date > today;
                const isToday = date === today;

                const dayBubble = document.createElement('button');
                dayBubble.type = 'button';
                dayBubble.className = 'habit-day-bubble';

                if (!isDayScheduled) dayBubble.classList.add('off');
                else if (isDayDone) dayBubble.classList.add('done');
                else if (isFuture) dayBubble.classList.add('future');
                else dayBubble.classList.add('missed');

                if (isToday) dayBubble.classList.add('today');

                // Day initial (M, T, W, T, F, S, S)
                dayBubble.textContent = dayLetters[(i + 1) % 7];

                const dayNameFull = dayNames[(i + 1) % 7];
                dayBubble.title = `${dayNameFull}, ${date}: ${isDayDone ? 'Completed' : !isDayScheduled ? 'Rest day' : isFuture ? 'Upcoming' : 'Not completed'} (Click to toggle)`;

                // Click to toggle any day (past or today)
                if (!isFuture) {
                    dayBubble.addEventListener('click', e => {
                        e.stopPropagation();
                        if (isDayDone) {
                            habit.history[date] = 0;
                        } else {
                            habit.history[date] = habit.target || 1;
                            showHabitToast(`Marked ${dayNameFull} as completed`);
                        }
                        persist();
                    });
                } else {
                    dayBubble.disabled = true;
                }

                weekSection.appendChild(dayBubble);
            }

            // Right Section: Streak Pill + Action Buttons
            const rightSection = document.createElement('div');
            rightSection.className = 'habit-right';

            const currentStreak = streak(habit, today);
            const streakPill = document.createElement('div');
            streakPill.className = `habit-streak-pill${currentStreak > 0 ? ' is-active' : ' is-zero'}`;
            streakPill.title = `${currentStreak} day streak`;
            streakPill.innerHTML = `
                <span class="streak-flame">${currentStreak > 0 ? '🔥' : '⚡'}</span>
                <span class="streak-count">${currentStreak}</span>
            `;

            const actions = document.createElement('div');
            actions.className = 'habit-row-actions';

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'habit-action-btn';
            editBtn.title = 'Edit habit';
            editBtn.innerHTML = '<i data-lucide="pencil" class="icon"></i>';
            editBtn.addEventListener('click', () => openHabitModal(habit));

            const archiveBtn = document.createElement('button');
            archiveBtn.type = 'button';
            archiveBtn.className = 'habit-action-btn';
            archiveBtn.title = habit.archived ? 'Restore habit' : 'Archive habit';
            archiveBtn.innerHTML = `<i data-lucide="${habit.archived ? 'rotate-ccw' : 'archive'}" class="icon"></i>`;
            archiveBtn.addEventListener('click', () => {
                habit.archived = !habit.archived;
                persist();
                showHabitToast(habit.archived ? 'Habit archived' : 'Habit restored');
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'habit-action-btn danger';
            deleteBtn.title = 'Delete habit';
            deleteBtn.innerHTML = '<i data-lucide="trash-2" class="icon"></i>';
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Delete habit "${habit.name}"?`)) {
                    habits = habits.filter(h => h.id !== habit.id);
                    persist();
                    showHabitToast('Habit deleted');
                }
            });

            actions.append(editBtn, archiveBtn, deleteBtn);
            rightSection.append(streakPill, actions);

            card.append(leftSection, weekSection, rightSection);
            return card;
        }

        activeHabits.forEach(habit => list.appendChild(createHabitCard(habit)));

        if (archivedHabits.length) {
            archivedContainer.hidden = false;
            archivedCountEl.textContent = archivedHabits.length;
            archivedHabits.forEach(habit => archivedList.appendChild(createHabitCard(habit)));
        } else {
            archivedContainer.hidden = true;
        }

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            lucide.createIcons({ root: section });
        }
    }

    render();

    let lastDay = typeof localDateKey === 'function' ? localDateKey() : '';
    setInterval(() => {
        const nowDay = typeof localDateKey === 'function' ? localDateKey() : '';
        if (nowDay && nowDay !== lastDay) {
            lastDay = nowDay;
            render();
        }
    }, 30000);

    window.addEventListener('storage', event => {
        if (event.key === storageKey) {
            try {
                const saved = JSON.parse(event.newValue || '[]');
                if (Array.isArray(saved)) {
                    habits = saved;
                    render();
                }
            } catch {}
        }
    });
})();
