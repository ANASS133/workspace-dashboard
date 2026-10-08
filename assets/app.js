// --- Secret Code Logic ---
    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }
    window.refreshIcons = refreshIcons;
    
    // Spiritual reminders: Quran, authentic hadith, and clearly labelled wisdom.
    const spiritualQuotes = [
        {
            type: "Quran",
            arabic: "قُل لِّلْمُؤْمِنِينَ يَغُضُّوا۟ مِنْ أَبْصَـٰرِهِمْ وَيَحْفَظُوا۟ فُرُوجَهُمْ ۚ ذَٰلِكَ أَزْكَىٰ لَهُمْ",
            text: "Tell the believing men to lower their gaze and guard their chastity. That is purer for them.",
            source: "Surat An-Nur — 24:30"
        },
        {
            type: "Quran",
            arabic: "وَأَمَّا مَنْ خَافَ مَقَامَ رَبِّهِۦ وَنَهَى ٱلنَّفْسَ عَنِ ٱلْهَوَىٰ ۝ فَإِنَّ ٱلْجَنَّةَ هِىَ ٱلْمَأْوَىٰ",
            text: "As for the one who feared standing before their Lord and restrained the self from desire, Paradise will certainly be their home.",
            source: "Surat An-Nazi'at — 79:40–41"
        },
        {
            type: "Quran",
            arabic: "إِنَّ ٱلنَّفْسَ لَأَمَّارَةٌۢ بِٱلسُّوٓءِ إِلَّا مَا رَحِمَ رَبِّىٓ",
            text: "Indeed, the soul is ever inclined to evil, except those shown mercy by my Lord.",
            source: "Surat Yusuf — 12:53"
        },
        {
            type: "Sahih Hadith",
            arabic: "يَا مَعْشَرَ الشَّبَابِ مَنِ اسْتَطَاعَ الْبَاءَةَ فَلْيَتَزَوَّجْ، فَإِنَّهُ أَغَضُّ لِلْبَصَرِ وَأَحْصَنُ لِلْفَرْجِ، وَمَنْ لَمْ يَسْتَطِعْ فَعَلَيْهِ بِالصَّوْمِ، فَإِنَّهُ لَهُ وِجَاءٌ",
            text: "Young people, whoever is able should marry, for it helps lower the gaze and guard chastity; whoever cannot should fast, for it is a shield.",
            source: "Sahih al-Bukhari 5066"
        },
        {
            type: "Sahih Hadith",
            arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
            text: "The strong person is not the one who overcomes others, but the one who controls himself when angry.",
            source: "Sahih al-Bukhari 6114; Sahih Muslim 2609a"
        },
        {
            type: "Sahih Hadith",
            arabic: "وَمَا أُعْطِيَ أَحَدٌ عَطَاءً خَيْرًا وَأَوْسَعَ مِنَ الصَّبْرِ",
            text: "No one is given a gift better and more encompassing than patience.",
            source: "Sahih al-Bukhari 1469; Sahih Muslim 1053"
        },
        {
            type: "Scholar's wisdom",
            arabic: "صَبْرُ النَّفْسِ عَنِ الشَّهْوَةِ أَيْسَرُ مِنَ الصَّبْرِ عَلَى مَا تُوجِبُهُ الشَّهْوَةُ",
            text: "Patience in resisting desire is easier than patience in bearing the consequences desire brings.",
            source: "Ibn al-Qayyim — Al-Fawa'id"
        },
        {
            type: "Discipline mindset",
            arabic: "",
            text: "An urge is a wave, not an order. Let it rise, breathe through it, and let it pass without obeying it.",
            source: "Practical self-discipline reminder"
        },
        {
            type: "تذكير بالانضباط",
            arabic: "انتصارك الوحيد في الخلوة هو أن تختار شغفك ومستقبلك على متعة زائلة لا تتعدى ثوانٍ.",
            text: "",
            source: "تذكير تحفيزي"
        },
        {
            type: "تذكير بالانضباط",
            arabic: "الرجولة الحقيقية هي القوة على ضبط نفسك عندما لا يراك أحد.",
            text: "",
            source: "تذكير تحفيزي"
        },
        {
            type: "تذكير بالانضباط",
            arabic: "كل مرة تقاوم فيها الرغبة، أنت تبني عقلًا أقوى وتركيزًا أعمق وشخصية لا تُهزم.",
            text: "",
            source: "تذكير تحفيزي"
        },
        {
            type: "تذكير بالانضباط",
            arabic: "متعة اللذة الفانية تنتهي في لحظتها، لكن العار وضبابية الذهن وضياع الوقت يمتدون لأيام.",
            text: "",
            source: "تذكير تحفيزي"
        },
        {
            type: "تذكير بالانضباط",
            arabic: "لا تضحي بأهدافك الكبرى، وتركيزك، ونقاء عقلك من أجل شاشة لا تقدم لك شيئًا سوى الندم.",
            text: "",
            source: "تذكير تحفيزي"
        },
        {
            type: "تذكير بالانضباط",
            arabic: "عقلك ومستقبلك يستحقان الحماية؛ لا تجعل شهوة عابرة تسرق منك شغفك وطاقتك.",
            text: "",
            source: "تذكير تحفيزي"
        },
        {
            type: "تذكير بالانضباط",
            arabic: "الفرق بين من يحقق أحلامه ومن يبقى في مكانه هو القدرة على التحكم في الرغبات اللحظية.",
            text: "",
            source: "تذكير تحفيزي"
        },
        {
            type: "تذكير بالانضباط",
            arabic: "أنت لست عبدًا لمشاعرك أو لدوافعك؛ أنت صاحب القرار والسيطرة على حياتك.",
            text: "",
            source: "تذكير تحفيزي"
        },
        {
            type: "تذكير بالانضباط",
            arabic: "كلما أغلقت الشاشة واخترت الصبر، كلما استرجعت احترامك لنفسك وثقتك بذكائك.",
            text: "",
            source: "تذكير تحفيزي"
        },
        {
            type: "تذكير بالانضباط",
            arabic: "لحظة الألم الناجمة عن الامتناع هي ذاتها اللحظة التي تنمو فيها إرادتك وتصنع شخصيتك الجديدة.",
            text: "",
            source: "تذكير تحفيزي"
        }
    ];

    let currentQuoteIndex = -1;

    const SECRET_PIN_HASH_KEY = 'dashboard_secret_pin_hash';

    async function hashSecretPin(value) {
        if (globalThis.crypto?.subtle) {
            const bytes = new TextEncoder().encode(value);
            const digest = await crypto.subtle.digest('SHA-256', bytes);
            return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
        }
        // file:// fallback: avoids storing the PIN as plaintext when Web Crypto is unavailable.
        let hash = 2166136261;
        for (const char of value) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
        return `local-${(hash >>> 0).toString(16).padStart(8, '0')}`;
    }

    function promptSecretCode() { showPinDialog(false); }

    function changeSecretPin() { showPinDialog(true); }

    function showPinDialog(changing) {
        if (document.getElementById('pinDialog')) return;
        const returnFocus = document.activeElement;
        const dialog = document.createElement('dialog');
        dialog.id = 'pinDialog';
        dialog.className = 'pin-dialog';
        dialog.setAttribute('aria-labelledby', 'pinDialogTitle');
        dialog.innerHTML = `<form>
            <h2 id="pinDialogTitle">${changing ? 'Change PIN' : 'Unlock area'}</h2>
            <p class="pin-message" role="status"></p>
            <label class="pin-current-label">PIN<input name="current" type="password" inputmode="numeric" autocomplete="current-password" required></label>
            <div class="pin-new-fields" hidden>
                <label>New PIN<input name="next" type="password" inputmode="numeric" autocomplete="new-password" pattern="[0-9]{4,12}" minlength="4" maxlength="12"></label>
                <label>Confirm PIN<input name="confirm" type="password" inputmode="numeric" autocomplete="new-password" maxlength="12"></label>
            </div>
            <p class="pin-error" role="alert"></p>
            <div class="pin-actions"><button type="button" class="pin-cancel">Cancel</button><button type="submit">Unlock</button></div>
        </form>`;
        document.body.append(dialog);
        const form = dialog.querySelector('form');
        const current = form.elements.namedItem('current');
        const next = form.elements.namedItem('next');
        const confirm = form.elements.namedItem('confirm');
        const error = dialog.querySelector('.pin-error');
        const submit = dialog.querySelector('[type="submit"]');
        const close = () => { dialog.close(); dialog.remove(); returnFocus?.focus(); };
        dialog.querySelector('.pin-cancel').onclick = close;
        dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
        let savedHash;
        try { savedHash = localStorage.getItem(SECRET_PIN_HASH_KEY); }
        catch { error.textContent = 'Browser storage is unavailable. Allow site storage and try again.'; submit.disabled = true; }
        const creating = !savedHash;
        current.disabled = creating;
        dialog.querySelector('.pin-current-label').hidden = creating;
        if (creating || changing) {
            dialog.querySelector('.pin-new-fields').hidden = false;
            next.required = true;
            confirm.required = true;
            submit.textContent = changing ? 'Save PIN' : 'Create PIN & open';
            dialog.querySelector('.pin-message').textContent = 'Choose a PIN with 4?12 digits.';
        }
        dialog.showModal();
        (creating ? next : current).focus();
        form.addEventListener('submit', async event => {
            event.preventDefault();
            error.textContent = '';
            submit.disabled = true;
            try {
                if (!creating && await hashSecretPin(current.value) !== savedHash) {
                    error.textContent = 'Incorrect PIN. Try again.';
                    current.select(); return;
                }
                if (creating || changing) {
                    if (next.value !== confirm.value) { error.textContent = 'PINs do not match.'; confirm.focus(); return; }
                    localStorage.setItem(SECRET_PIN_HASH_KEY, await hashSecretPin(next.value));
                }
                if (!dialog.isConnected) return;
                // Render before closing so an error remains visible in this dialog.
                openSecretModal();
                close();
            } catch (failure) {
                error.textContent = 'Unable to open the area. Please reload and try again.';
                console.error('Unlock failed:', failure);
            } finally { submit.disabled = false; }
        });
    }

    // Keyboard shortcut: Ctrl + Shift + N
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('pinDialog')) return;
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            promptSecretCode();
        }

        if (e.key === 'Escape') {
            if (document.getElementById('emergencyModal').style.display === 'flex') closeEmergency();
            else if (document.getElementById('taskEditModal')?.style.display === 'flex') closeTaskEditor();
            else if (document.getElementById('dataManagerModal')?.style.display === 'flex') closeDataManager();
            else if (document.getElementById('nofapModal').style.display === 'flex') closeModal();
        }
    });

    function openSecretModal() {
        updateCounter();
        showRandomQuote();
        document.getElementById('nofapModal').style.display = 'flex';
    }

    function closeModal() {
        document.getElementById('nofapModal').style.display = 'none';
    }

    function showRandomQuote() {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * spiritualQuotes.length);
        } while (spiritualQuotes.length > 1 && nextIndex === currentQuoteIndex);
        displayQuote(nextIndex);
    }

    function showNextQuote() {
        displayQuote((currentQuoteIndex + 1) % spiritualQuotes.length);
    }

    function displayQuote(index) {
        currentQuoteIndex = index;
        const quote = spiritualQuotes[index];
        const arabicElement = document.getElementById('quoteArabic');
        const textElement = document.getElementById('quoteText');
        document.getElementById('quoteType').textContent = quote.type;
        arabicElement.textContent = quote.arabic;
        arabicElement.hidden = !quote.arabic;
        textElement.textContent = quote.text;
        textElement.hidden = !quote.text;
        document.getElementById('quoteSource').textContent = quote.source;
    }

    function openEmergency() {
        document.getElementById('emergencyModal').style.display = 'flex';
    }

    function closeEmergency() {
        document.getElementById('emergencyModal').style.display = 'none';
    }

    // --- NoFap Logic ---
    const DAY_MS = 24 * 60 * 60 * 1000;
    const MILESTONES = [7, 14, 30, 60, 90];

    function readValidStartDate() {
        const storedValue = Number(localStorage.getItem('nofap_start_date'));
        const now = Date.now();
        if (Number.isFinite(storedValue) && storedValue > 0 && storedValue <= now) return storedValue;
        localStorage.setItem('nofap_start_date', String(now));
        return now;
    }

    function readStreakHistory() {
        try {
            const parsed = JSON.parse(localStorage.getItem('nofap_streak_history'));
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(item =>
                item && Number.isFinite(item.start) && Number.isFinite(item.end) &&
                item.end >= item.start && item.start > 0
            ).map(item => ({
                start: item.start,
                end: item.end,
                durationMs: Math.max(0, Number(item.durationMs) || item.end - item.start),
                reason: typeof item.reason === 'string' ? item.reason.slice(0, 120) : ''
            }));
        } catch {
            return [];
        }
    }

    let startDate = readValidStartDate();
    let streakHistory = readStreakHistory();
    let lastRenderedDay = -1;

    function getCurrentDuration(now = Date.now()) {
        return Math.max(0, now - startDate);
    }

    function formatDate(timestamp, includeTime = false) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        if (includeTime) Object.assign(options, { hour: '2-digit', minute: '2-digit' });
        return new Intl.DateTimeFormat(undefined, options).format(new Date(timestamp));
    }

    function getNextMilestone(currentDays) {
        const preset = MILESTONES.find(days => days > currentDays);
        return preset || (Math.floor(currentDays / 30) + 1) * 30;
    }

    function updateCounter() {
        const duration = getCurrentDuration();
        const totalSeconds = Math.floor(duration / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        document.getElementById('daysCount').textContent = days;
        document.getElementById('liveTime').textContent =
            `${String(hours).padStart(2, '0')} hours · ${String(minutes).padStart(2, '0')} minutes · ${String(seconds).padStart(2, '0')} seconds`;

        if (days !== lastRenderedDay) {
            lastRenderedDay = days;
            renderStreakDetails();
        }
    }

    function renderStreakDetails() {
        const now = Date.now();
        const currentMs = getCurrentDuration(now);
        const currentDays = Math.floor(currentMs / DAY_MS);
        const completedDurations = streakHistory.map(item => item.durationMs);
        const bestMs = Math.max(currentMs, 0, ...completedDurations);
        const totalMs = completedDurations.reduce((sum, duration) => sum + duration, 0) + currentMs;
        const nextMilestone = getNextMilestone(currentDays);
        const previousMilestone = [...MILESTONES].reverse().find(days => days <= currentDays) ||
            (currentDays > 90 ? Math.floor(currentDays / 30) * 30 : 0);
        const segmentSize = nextMilestone - previousMilestone;
        const progress = Math.min(100, Math.max(0, ((currentDays - previousMilestone) / segmentSize) * 100));
        const remaining = nextMilestone - currentDays;

        document.getElementById('bestStreak').textContent = `${Math.floor(bestMs / DAY_MS)} d`;
        document.getElementById('totalCleanDays').textContent = `${Math.floor(totalMs / DAY_MS)} d`;
        document.getElementById('resetCount').textContent = streakHistory.length;
        document.getElementById('milestoneName').textContent = `${nextMilestone}-day milestone`;
        document.getElementById('milestonePercent').textContent = `${Math.floor(progress)}%`;
        document.getElementById('milestoneProgress').style.width = `${progress}%`;
        document.getElementById('milestoneNote').textContent =
            `${remaining} ${remaining === 1 ? 'day' : 'days'} to go — keep choosing the next right action.`;
        document.getElementById('startDateLabel').textContent = `Started: ${formatDate(startDate, true)}`;
        document.getElementById('nextMilestoneDate').textContent =
            `Estimated ${nextMilestone}-day date: ${formatDate(startDate + nextMilestone * DAY_MS)}`;

        const achieved = [...MILESTONES].reverse().find(days => days <= currentDays);
        const message = document.getElementById('milestoneMessage');
        if (achieved) {
            document.getElementById('milestoneMessageText').textContent = `${achieved}-day milestone achieved. Alhamdulillah — stay grounded.`;
            message.style.display = 'flex';
        } else {
            message.style.display = 'none';
        }

        renderActivityRow(now);
        renderStreakHistory();
        refreshIcons();
    }

    function renderActivityRow(now) {
        const row = document.getElementById('activityRow');
        row.replaceChildren();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        const streakStartDay = new Date(startDate);
        streakStartDay.setHours(0, 0, 0, 0);

        for (let offset = 6; offset >= 0; offset--) {
            const date = new Date(today);
            date.setDate(today.getDate() - offset);
            const active = date.getTime() >= streakStartDay.getTime();
            const item = document.createElement('div');
            item.className = `activity-day${active ? ' active' : ''}`;
            item.title = `${formatDate(date.getTime())}: ${active ? 'current streak' : 'before current streak'}`;

            const dot = document.createElement('div');
            dot.className = 'activity-dot';
            const icon = document.createElement('i');
            icon.setAttribute('data-lucide', active ? 'check' : 'minus');
            icon.className = 'icon';
            dot.appendChild(icon);

            const label = document.createElement('span');
            label.textContent = new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date).slice(0, 2);
            item.append(dot, label);
            row.appendChild(item);
        }
    }

    function renderStreakHistory() {
        const container = document.getElementById('streakHistory');
        container.replaceChildren();
        if (!streakHistory.length) {
            const empty = document.createElement('p');
            empty.className = 'history-empty';
            empty.textContent = 'No previous streaks. This is your first recorded journey.';
            container.appendChild(empty);
            return;
        }

        [...streakHistory].reverse().slice(0, 10).forEach(item => {
            const entry = document.createElement('div');
            entry.className = 'history-item';
            const details = document.createElement('div');
            details.textContent = `${formatDate(item.start)} → ${formatDate(item.end)}`;
            if (item.reason) {
                const reason = document.createElement('span');
                reason.className = 'history-reason';
                reason.textContent = item.reason;
                details.appendChild(reason);
            }
            const duration = document.createElement('strong');
            const days = Math.floor(item.durationMs / DAY_MS);
            if (days > 0) {
                duration.textContent = `${days} d`;
            } else {
                const hours = Math.floor(item.durationMs / (60 * 60 * 1000));
                duration.textContent = hours > 0 ? `${hours} h` : `${Math.max(1, Math.floor(item.durationMs / 60000))} m`;
            }
            entry.append(details, duration);
            container.appendChild(entry);
        });
    }

    function resetCounter() {
        showResetStreakDialog();
    }

    function showResetStreakDialog() {
        if (document.getElementById('resetStreakDialog')) return;
        const returnFocus = document.activeElement;
        const dialog = document.createElement('dialog');
        dialog.id = 'resetStreakDialog';
        dialog.className = 'pin-dialog reset-streak-dialog';
        dialog.setAttribute('aria-labelledby', 'resetStreakDialogTitle');
        dialog.innerHTML = `
        <form method="dialog">
            <h2 id="resetStreakDialogTitle" style="display: flex; align-items: center; gap: 8px; color: #ef4444;"><i data-lucide="rotate-ccw" class="icon"></i> Reset Streak</h2>
            <p class="reset-streak-desc">Are you sure you want to reset your streak? Your current streak will be preserved in your streak history.</p>
            <label>
                <span>Trigger or reflection note (optional)</span>
                <input name="reason" type="text" maxlength="120" placeholder="e.g. fatigue, late phone use, urge...">
            </label>
            <div class="pin-actions">
                <button type="button" class="pin-cancel">Cancel</button>
                <button type="submit" class="reset-btn-danger">Confirm Reset</button>
            </div>
            <button type="button" class="reset-clear-history" id="clearAllStreakHistoryBtn">Wipe all streak history & resets</button>
        </form>`;
        document.body.append(dialog);

        const form = dialog.querySelector('form');
        const reasonInput = form.elements.namedItem('reason');
        const clearBtn = dialog.querySelector('#clearAllStreakHistoryBtn');
        const close = () => { dialog.close(); dialog.remove(); returnFocus?.focus(); };

        dialog.querySelector('.pin-cancel').onclick = close;
        dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });

        form.addEventListener('submit', event => {
            event.preventDefault();
            const reason = (reasonInput.value || '').trim().slice(0, 120);
            const now = Date.now();
            const completedDuration = getCurrentDuration(now);
            streakHistory.push({
                start: startDate,
                end: now,
                durationMs: completedDuration,
                reason: reason
            });
            try {
                localStorage.setItem('nofap_streak_history', JSON.stringify(streakHistory));
            } catch (e) {
                console.error('Error saving streak history:', e);
            }
            startDate = now;
            try {
                localStorage.setItem('nofap_start_date', String(startDate));
            } catch (e) {
                console.error('Error saving start date:', e);
            }
            lastRenderedDay = -1;
            updateCounter();
            renderStreakDetails();
            showResetFeedback('Streak reset. Starting fresh — one day at a time!');
            close();
        });

        clearBtn.addEventListener('click', () => {
            if (clearBtn.dataset.confirming !== 'true') {
                clearBtn.dataset.confirming = 'true';
                clearBtn.textContent = 'Click again to confirm wiping all history';
                clearBtn.style.color = '#ef4444';
                clearBtn.style.borderColor = '#ef4444';
                return;
            }
            streakHistory = [];
            const now = Date.now();
            startDate = now;
            try {
                localStorage.setItem('nofap_streak_history', JSON.stringify(streakHistory));
                localStorage.setItem('nofap_start_date', String(startDate));
            } catch (e) {
                console.error('Error clearing streak history:', e);
            }
            lastRenderedDay = -1;
            updateCounter();
            renderStreakDetails();
            showResetFeedback('Streak and history have been cleared.');
            close();
        });

        refreshIcons();
        dialog.showModal();
        reasonInput.focus();
    }

    function showResetFeedback(message) {
        const alertEl = document.getElementById('streakResetAlert');
        if (alertEl) {
            alertEl.textContent = message;
            alertEl.style.display = 'flex';
            setTimeout(() => {
                alertEl.style.display = 'none';
            }, 5000);
        }
    }

    window.resetCounter = resetCounter;

    setInterval(updateCounter, 1000);

    // --- To-Do List Logic (Multi-category) ---
    const categories = ['lang', 'cyber', 'train', 'din', 'work', 'proj'];
    const categoryColors = {
        lang: '#f59e0b', cyber: '#10b981', train: '#ef4444',
        din: '#06b6d4', work: '#8b5cf6', proj: '#ec4899'
    };
    const DASHBOARD_SCHEMA_VERSION = 2;
    localStorage.setItem('dashboard_schema_version', String(DASHBOARD_SCHEMA_VERSION));

    function isValidDateKey(value) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value); }
    function cleanText(value, max = 300) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }

    function readTodos() {
        try {
            const stored = JSON.parse(localStorage.getItem('dashboard_todos'));
            return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
        } catch {
            return {};
        }
    }

    function readProductivityDates() {
        try {
            const stored = JSON.parse(localStorage.getItem('productivity_completion_dates'));
            return Array.isArray(stored)
                ? [...new Set(stored.filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date)))].sort()
                : [];
        } catch {
            return [];
        }
    }

    let todos = readTodos();
    let productivityDates = readProductivityDates();
    let taskSearchQuery = '';
    let taskStatusFilter = 'today';
    let draggedTask = null;
    const expandedTaskIds = new Set();
    const validPriorities = ['high', 'medium', 'low'];
    const priorityRank = { high: 0, medium: 1, low: 2 };
    const recurrenceOptions = [
        { value: 'once', label: 'Once', icon: 'calendar-1', title: 'One-time task' },
        { value: 'habit', label: 'Daily', icon: 'repeat-2', title: 'Daily task — resets every day at local midnight' },
        { value: 'weekly', label: 'Weekly', icon: 'calendar-days', title: 'Weekly task — resets at the start of each week' },
        { value: 'monthly', label: 'Monthly', icon: 'calendar-range', title: 'Monthly task — resets at the start of each month' }
    ];
    const validRecurrences = recurrenceOptions.map(option => option.value);

    function createLocalId() {
        return globalThis.crypto?.randomUUID?.() || `task-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    // Initialize categories if not present
    categories.forEach(cat => {
        if (!Array.isArray(todos[cat])) todos[cat] = [];
        todos[cat] = todos[cat].filter(todo => todo && typeof todo.text === 'string').map(todo => ({
            id: typeof todo.id === 'string' && todo.id ? todo.id : createLocalId(),
            text: cleanText(todo.text, 200),
            completed: Boolean(todo.completed),
            priority: validPriorities.includes(todo.priority) ? todo.priority : 'medium',
            recurrence: validRecurrences.includes(todo.recurrence)
                ? todo.recurrence
                : (todo.recurring ? 'habit' : 'once'),
            dueDate: isValidDateKey(todo.dueDate) ? todo.dueDate : '',
            weeklyTargetId: typeof todo.weeklyTargetId === 'string' ? todo.weeklyTargetId : '',
            scheduleStart: isValidDateKey(todo.scheduleStart) ? todo.scheduleStart : (isValidDateKey(todo.dueDate) ? todo.dueDate : ''),
            completedDates: Array.isArray(todo.completedDates) ? todo.completedDates.filter(isValidDateKey) : [],
            subtasks: Array.isArray(todo.subtasks) ? todo.subtasks
                .filter(subtask => subtask && typeof subtask.text === 'string')
                .map(subtask => ({
                    id: typeof subtask.id === 'string' && subtask.id ? subtask.id : createLocalId(),
                    text: cleanText(subtask.text, 160),
                    completed: Boolean(subtask.completed)
                })) : []
        }));
    });
    localStorage.setItem('dashboard_todos', JSON.stringify(todos));





    function cycleDrawerTaskRecurrence() {
        const button = document.getElementById('drawerTaskRecurrence');
        const current = recurrenceOptions.findIndex(option => option.value === button.value);
        const next = recurrenceOptions[(current + 1) % recurrenceOptions.length];
        button.value = next.value;
        button.classList.toggle('is-repeating', next.value !== 'once');
        button.title = `${next.label}; click to change`;
        button.setAttribute('aria-label', `Repeat: ${next.label}; click to change`);
        button.innerHTML = `<i data-lucide="${next.icon}" class="icon"></i>`;
        refreshIcons();
    }

    function addDrawerScheduledTask() {
        const titleInput = document.getElementById('drawerTaskTitle');
        const catSelect = document.getElementById('drawerTaskCategory');
        const prioritySelect = document.getElementById('drawerTaskPriority');
        const text = cleanText(titleInput?.value.trim() || catSelect.options[catSelect.selectedIndex].text, 200);
        const cat = catSelect ? catSelect.value : 'lang';
        const priority = prioritySelect ? prioritySelect.value : 'medium';
        const task = {
            id: createLocalId(),
            text,
            completed: false,
            priority,
            recurrence: document.getElementById('drawerTaskRecurrence').value,
            dueDate: selectedDateKey,
            weeklyTargetId: document.getElementById('drawerTaskTarget').value,
            scheduleStart: selectedDateKey,
            completedDates: [],
            subtasks: []
        };
        const insertionIndex = todos[cat].findIndex(item => priorityRank[item.priority] > priorityRank[priority]);
        if (insertionIndex === -1) todos[cat].push(task);
        else todos[cat].splice(insertionIndex, 0, task);

        titleInput.value = '';
        saveAndRender();
    }

    function installSearchAndFilters() {
        const search = document.getElementById('taskSearch');
        const clear = document.getElementById('clearSearch');
        search.addEventListener('input', () => {
            taskSearchQuery = search.value.trim().toLocaleLowerCase();
            clear.classList.toggle('visible', Boolean(taskSearchQuery));
            renderTodos();
            renderObjectives();
            renderCalendar();
        });
        clear.addEventListener('click', () => {
            search.value = '';
            taskSearchQuery = '';
            clear.classList.remove('visible');
            search.focus();
            renderTodos();
            renderObjectives();
            renderCalendar();
        });
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                taskStatusFilter = button.dataset.filter;
                document.querySelectorAll('.filter-btn').forEach(item => item.classList.toggle('active', item === button));
                renderTodos();
            });
        });
    }

    function taskMatchesFilters(todo) {
        const matchesSearch = !taskSearchQuery || todo.text.toLocaleLowerCase().includes(taskSearchQuery) ||
            todo.subtasks.some(subtask => subtask.text.toLocaleLowerCase().includes(taskSearchQuery));
        const today = localDateKey();
        const occursOn = key => taskOccursOn(todo, key) || (todo.recurrence === 'habit' && !todo.dueDate);
        let matchesDate = false;
        if (taskStatusFilter === 'today') matchesDate = occursOn(today);
        if (taskStatusFilter === 'week') {
            const dayOfWeek = (new Date(`${today}T12:00:00`).getDay() + 6) % 7;
            const weekStart = offsetDateKey(today, -dayOfWeek);
            matchesDate = Array.from({ length: 7 }, (_, day) => offsetDateKey(weekStart, day)).some(occursOn);
        }
        const matchesStatus = matchesDate ||
            (taskStatusFilter === 'active' && !todo.completed) ||
            (taskStatusFilter === 'completed' && todo.completed);
        return matchesSearch && matchesStatus;
    }

    function clearDropIndicators() {
        document.querySelectorAll('.drop-before, .drop-after').forEach(item => item.classList.remove('drop-before', 'drop-after'));
        document.querySelectorAll('.drag-over-empty').forEach(item => item.classList.remove('drag-over-empty'));
    }

    function moveTask(sourceCat, sourceIndex, targetCat, targetIndex) {
        if (!todos[sourceCat]?.[sourceIndex] || !todos[targetCat]) return;
        const [moved] = todos[sourceCat].splice(sourceIndex, 1);
        let insertionIndex = targetIndex;
        if (sourceCat === targetCat && sourceIndex < insertionIndex) insertionIndex--;
        insertionIndex = Math.max(0, Math.min(insertionIndex, todos[targetCat].length));
        todos[targetCat].splice(insertionIndex, 0, moved);
        saveAndRender();
    }

    function installDropZones() {
        categories.forEach(cat => {
            const list = document.getElementById(`list-${cat}`);
            list.addEventListener('dragover', event => {
                if (!draggedTask || event.target.closest('li[data-task-item]')) return;
                event.preventDefault();
                list.classList.add('drag-over-empty');
            });
            list.addEventListener('dragleave', event => {
                if (!list.contains(event.relatedTarget)) list.classList.remove('drag-over-empty');
            });
            list.addEventListener('drop', event => {
                if (!draggedTask || event.target.closest('li[data-task-item]')) return;
                event.preventDefault();
                moveTask(draggedTask.cat, draggedTask.index, cat, todos[cat].length);
                draggedTask = null;
                clearDropIndicators();
            });
        });
    }









    function advanceRecurringDueDate(todo, today) {
        if (!todo.dueDate || !isValidDateKey(todo.dueDate)) return;
        if (!todo.scheduleStart) todo.scheduleStart = todo.dueDate;
        setOccurrenceCompleted(todo, todo.dueDate, todo.completed);
        let due = new Date(`${todo.dueDate}T12:00:00`);
        const todayDate = new Date(`${today}T12:00:00`);
        if (todo.recurrence === 'habit' && due < todayDate) { todo.dueDate = today; todo.completed = (todo.completedDates || []).includes(today); return; }
        if (todo.recurrence === 'weekly') {
            while (due < todayDate) due.setDate(due.getDate() + 7);
            todo.dueDate = localDateKey(due);
        } else if (todo.recurrence === 'monthly') {
            const anchor = new Date(`${todo.scheduleStart}T12:00:00`);
            let months = (todayDate.getFullYear() - anchor.getFullYear()) * 12 + todayDate.getMonth() - anchor.getMonth();
            due = addMonthsClamped(anchor, Math.max(0, months));
            if (due < todayDate) due = addMonthsClamped(anchor, Math.max(0, months) + 1);
            todo.dueDate = localDateKey(due);
        }
        if (todo.recurrence !== 'once') todo.completed = (todo.completedDates || []).includes(todo.dueDate);
    }

    function resetRecurringTasksIfNeeded() {
        const today = localDateKey();
        const storedCheck = localStorage.getItem('dashboard_last_recurrence_check') || localStorage.getItem('dashboard_last_daily_reset');
        if (!isValidDateKey(storedCheck || '')) {
            localStorage.setItem('dashboard_last_recurrence_check', today);
            categories.forEach(cat => todos[cat].forEach(todo => advanceRecurringDueDate(todo, today)));
            localStorage.setItem('dashboard_todos', JSON.stringify(todos));
            return false;
        }
        const lastCheck = storedCheck;
        if (lastCheck === today) return false;

        const mondayWeekKey = key => {
            const date = new Date(`${key}T12:00:00`);
            const daysSinceMonday = (date.getDay() + 6) % 7;
            date.setDate(date.getDate() - daysSinceMonday);
            return localDateKey(date);
        };
        const entersNewWeek = mondayWeekKey(lastCheck) !== mondayWeekKey(today);
        const entersNewMonth = lastCheck.slice(0, 7) !== today.slice(0, 7);

        categories.forEach(cat => {
            todos[cat].forEach(todo => {
                if (todo.dueDate && todo.recurrence !== 'once') {
                    const previousDue = todo.dueDate;
                    advanceRecurringDueDate(todo, today);
                    if (previousDue !== todo.dueDate) todo.subtasks.forEach(subtask => { subtask.completed = false; });
                    return;
                }
                const shouldReset = todo.recurrence === 'habit' ||
                    (todo.recurrence === 'weekly' && entersNewWeek) ||
                    (todo.recurrence === 'monthly' && entersNewMonth);
                if (shouldReset) {
                    todo.completed = todo.recurrence === 'habit' && (todo.completedDates || []).includes(today);
                    todo.subtasks.forEach(subtask => { subtask.completed = false; });
                }
                advanceRecurringDueDate(todo, today);
            });
        });
        localStorage.setItem('dashboard_last_recurrence_check', today);
        localStorage.setItem('dashboard_todos', JSON.stringify(todos));
        return true;
    }

    function scheduleMidnightReset() {
        const nextMidnight = new Date();
        nextMidnight.setHours(24, 0, 0, 0);
        const delay = Math.max(1000, nextMidnight.getTime() - Date.now() + 100);
        setTimeout(() => {
            resetRecurringTasksIfNeeded();
            renderTodos();
            renderCalendar();
            updateObjectiveTimeAnchors();
            checkWeeklyRollover();
            checkMonthlyRollover();
            renderObjectives();
            scheduleMidnightReset();
        }, delay);
    }

    function renderCategoryProgress(cat) {
        const listEl = document.getElementById(`list-${cat}`);
        if (!listEl || !listEl.parentElement) return;
        const total = todos[cat].length;
        const completed = todos[cat].filter(todo => todo.completed).length;
        const percentage = total ? Math.round((completed / total) * 100) : 0;
        const oldProgress = listEl.parentElement.querySelector('.category-progress');
        if (oldProgress) oldProgress.remove();
        const header = listEl.parentElement.querySelector('.card-header');
        if (!header) return;
        let indicator = header.querySelector('.header-progress');
        if (!indicator) {
            indicator = document.createElement('span');
            indicator.className = 'header-progress';
            header.appendChild(indicator);
        }
        indicator.textContent = `${percentage}%`;
        indicator.title = `${completed} of ${total} tasks completed`;
        indicator.setAttribute('aria-label', indicator.title);
        indicator.style.borderColor = `${categoryColors[cat]}55`;
    }

    function taskCountsForProductivity(todo, today) {
        if (todo.recurrence === 'habit') return !todo.dueDate || todo.dueDate <= today;
        return todo.dueDate === today;
    }

    function getTodayOverview(now = new Date()) {
        const today = localDateKey(now);
        const tasks = categories.flatMap(cat => todos[cat]);
        const dueToday = tasks.filter(todo => taskOccursOn(todo, today) || (todo.recurrence === 'habit' && !todo.dueDate));
        const completed = dueToday.filter(todo => todo.dueDate ? taskCompletedOn(todo, today) : todo.completed).length;
        const overdue = tasks.filter(todo => todo.recurrence === 'once' && todo.dueDate && todo.dueDate < today && !todo.completed).length;
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const upcoming = calendarEvents.filter(evt => evt.date > today || (evt.date === today && (!evt.time || evt.time >= time)))
            .map(evt => ({ date: evt.date, time: evt.time || '', text: evt.title }));
        tasks.forEach(todo => {
            if (!todo.dueDate && todo.recurrence !== 'habit') return;
            let date = todo.dueDate && todo.dueDate > today ? todo.dueDate : today;
            // At most one year ahead covers every supported repeating schedule.
            for (let day = 0; day < 367; day++, date = offsetDateKey(date, 1)) {
                const completedOnDate = todo.dueDate ? taskCompletedOn(todo, date) : date === today && todo.completed;
                if ((taskOccursOn(todo, date) || (todo.recurrence === 'habit' && !todo.dueDate)) && !completedOnDate) {
                    upcoming.push({ date, time: '', text: todo.text });
                    break;
                }
                if (todo.recurrence === 'once') break;
            }
        });
        upcoming.sort((a, b) => a.date.localeCompare(b.date) || (a.time || '24:00').localeCompare(b.time || '24:00'));
        const dates = new Set(productivityDates);
        let cursor = dates.has(today) ? today : offsetDateKey(today, -1);
        let streak = 0;
        while (dates.has(cursor)) { streak++; cursor = offsetDateKey(cursor, -1); }
        return { total: dueToday.length, completed, overdue, remaining: dueToday.length - completed,
            progress: dueToday.length ? Math.round(completed / dueToday.length * 100) : 0, next: upcoming[0], streak };
    }

    function renderTodayOverview() {
        if (!document.getElementById('todayGreeting')) return;
        const now = new Date();
        const overview = getTodayOverview(now);
        const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
        document.getElementById('todayGreeting').textContent = `${greeting}, Anass 👋`;
        document.getElementById('todayTaskCount').textContent = overview.total;
        document.getElementById('todayOverdueCount').textContent = overview.overdue;
        document.getElementById('todayCompletedCount').textContent = overview.completed;
        document.getElementById('todayProgressValue').textContent = `${overview.progress}%`;
        document.getElementById('todayProgress').setAttribute('aria-valuenow', overview.progress);
        document.getElementById('todayProgressFill').style.width = `${overview.progress}%`;
        document.getElementById('todayStreak').textContent = `${overview.streak}-day streak`;
        document.getElementById('todaySummary').textContent = overview.total
            ? `${overview.remaining} ${overview.remaining === 1 ? 'task' : 'tasks'} remaining today · ${overview.progress}% of today's tasks completed`
            : 'A fresh day. Schedule a task to get started.';
        document.getElementById('todayNext').textContent = overview.next
            ? `Next: ${overview.next.text} · ${formatShortDate(overview.next.date)}${overview.next.time ? ` at ${overview.next.time}` : ' · No set time'}`
            : 'No upcoming tasks or events.';
    }

    function updateProductivityStreak() {
        const today = localDateKey();
        const todaysTasks = categories.flatMap(cat => todos[cat]).filter(todo => taskCountsForProductivity(todo, today));
        const allCompleted = todaysTasks.length > 0 && todaysTasks.every(todo => todo.completed);
        const dates = new Set(productivityDates);
        if (allCompleted) dates.add(today);
        else dates.delete(today);
        productivityDates = [...dates].sort();
        localStorage.setItem('productivity_completion_dates', JSON.stringify(productivityDates));
        let cursor = dates.has(today) ? today : offsetDateKey(today, -1);
        let streak = 0;
        while (dates.has(cursor)) { streak++; cursor = offsetDateKey(cursor, -1); }
        const streakEl = document.getElementById('productivityStreak');
        if (streakEl) {
            streakEl.textContent = `${streak}-Day Streak`;
            if (streakEl.parentElement) {
                streakEl.parentElement.title = todaysTasks.length
                    ? `${todaysTasks.filter(t => t.completed).length}/${todaysTasks.length} tasks due today completed`
                    : 'No tasks due today yet';
            }
        }
    }

    function createSubtaskPanel(cat, index, todo) {
        const panel = document.createElement('div');
        panel.className = 'subtask-panel';
        const completed = todo.subtasks.filter(subtask => subtask.completed).length;
        const total = todo.subtasks.length;
        const percentage = total ? Math.round((completed / total) * 100) : 0;

        const progressRow = document.createElement('div');
        progressRow.className = 'subtask-progress-row';
        progressRow.innerHTML = `<span>Checklist progress</span><strong>${percentage}%</strong>`;
        const progressTrack = document.createElement('div');
        progressTrack.className = 'subtask-progress-track';
        progressTrack.setAttribute('role', 'progressbar');
        progressTrack.setAttribute('aria-valuemin', '0');
        progressTrack.setAttribute('aria-valuemax', '100');
        progressTrack.setAttribute('aria-valuenow', String(percentage));
        const progressFill = document.createElement('div');
        progressFill.className = 'subtask-progress-fill';
        progressFill.style.width = `${percentage}%`;
        progressTrack.appendChild(progressFill);

        const list = document.createElement('div');
        list.className = 'subtask-list';
        todo.subtasks.forEach((subtask, subtaskIndex) => {
            const row = document.createElement('label');
            row.className = `subtask-item${subtask.completed ? ' completed' : ''}`;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = subtask.completed;
            checkbox.addEventListener('change', () => toggleSubtask(cat, index, subtaskIndex));
            const label = document.createElement('span');
            label.className = 'subtask-item-text';
            label.textContent = subtask.text;
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'subtask-delete';
            remove.title = 'Delete subtask';
            remove.setAttribute('aria-label', `Delete subtask: ${subtask.text}`);
            remove.innerHTML = '<i data-lucide="x" class="icon"></i>';
            remove.addEventListener('click', event => {
                event.preventDefault();
                deleteSubtask(cat, index, subtaskIndex);
            });
            row.append(checkbox, label, remove);
            list.appendChild(row);
        });

        const form = document.createElement('div');
        form.className = 'subtask-form';
        const input = document.createElement('input');
        input.className = 'subtask-input';
        input.type = 'text';
        input.placeholder = 'Add a smaller step...';
        input.setAttribute('aria-label', `Add subtask to ${todo.text}`);
        const add = document.createElement('button');
        add.type = 'button';
        add.className = 'subtask-add';
        add.title = 'Add subtask';
        add.setAttribute('aria-label', 'Add subtask');
        add.innerHTML = '<i data-lucide="plus" class="icon"></i>';
        const submit = () => addSubtask(cat, index, input.value);
        add.addEventListener('click', submit);
        input.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                submit();
            }
        });
        form.append(input, add);
        panel.append(progressRow, progressTrack, list, form);
        return panel;
    }

    function renderTodos() {
        categories.forEach(cat => {
            const listEl = document.getElementById(`list-${cat}`);
            listEl.replaceChildren();
            const visibleTasks = todos[cat]
                .map((todo, index) => ({ todo, index }))
                .filter(({ todo }) => taskMatchesFilters(todo));

            visibleTasks.forEach(({ todo, index }) => {
                const li = document.createElement('li');
                li.dataset.taskItem = 'true';
                if (todo.completed) li.classList.add('completed');
                li.addEventListener('dragover', event => {
                    if (!draggedTask) return;
                    event.preventDefault();
                    event.stopPropagation();
                    clearDropIndicators();
                    const after = event.clientY > li.getBoundingClientRect().top + li.offsetHeight / 2;
                    li.classList.add(after ? 'drop-after' : 'drop-before');
                    li.dataset.dropAfter = String(after);
                });
                li.addEventListener('drop', event => {
                    if (!draggedTask) return;
                    event.preventDefault();
                    event.stopPropagation();
                    const targetIndex = index + (li.dataset.dropAfter === 'true' ? 1 : 0);
                    moveTask(draggedTask.cat, draggedTask.index, cat, targetIndex);
                    draggedTask = null;
                    clearDropIndicators();
                });

                const dragHandle = document.createElement('span');
                dragHandle.className = 'drag-handle';
                dragHandle.draggable = true;
                dragHandle.title = 'Drag to reorder or move task';
                dragHandle.innerHTML = '<i data-lucide="grip-vertical" class="icon"></i>';
                dragHandle.addEventListener('dragstart', event => {
                    draggedTask = { cat, index };
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', `${cat}:${index}`);
                    requestAnimationFrame(() => li.classList.add('dragging'));
                });
                dragHandle.addEventListener('dragend', () => {
                    draggedTask = null;
                    li.classList.remove('dragging');
                    clearDropIndicators();
                });
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'task-checkbox';
                checkbox.checked = todo.completed;
                checkbox.setAttribute('aria-label', `Mark ${todo.text} as ${todo.completed ? 'active' : 'completed'}`);
                checkbox.addEventListener('change', () => toggleTodo(cat, index));
                const content = document.createElement('div');
                content.className = 'task-content';
                const text = document.createElement('span');
                text.className = 'text';
                text.textContent = todo.text;
                content.appendChild(text);
                const path = todo.weeklyTargetId ? objectivePath('weekly', todo.weeklyTargetId) : '';
                if (path) {
                    const breadcrumb = document.createElement('span');
                    breadcrumb.className = 'task-goal-path';
                    breadcrumb.textContent = path;
                    breadcrumb.title = path;
                    content.appendChild(breadcrumb);
                }
                text.addEventListener('click', () => toggleTodo(cat, index));

                const meta = document.createElement('div');
                meta.className = 'task-meta';
                const priority = document.createElement('button');
                priority.className = `priority-badge priority-${todo.priority}`;
                priority.title = 'Click to change priority';
                priority.setAttribute('aria-label', `${todo.priority} priority; click to change`);
                const dot = document.createElement('span');
                dot.className = 'priority-dot';
                priority.append(dot, document.createTextNode(todo.priority));
                priority.addEventListener('click', () => cycleTaskPriority(cat, index));
                meta.appendChild(priority);

                if (todo.dueDate) {
                    const dueBadge = document.createElement('span');
                    dueBadge.className = 'task-due-badge';
                    dueBadge.title = `Scheduled for: ${todo.dueDate}`;
                    dueBadge.innerHTML = `<i data-lucide="calendar" class="icon"></i><span>${formatShortDate(todo.dueDate)}</span>`;
                    meta.appendChild(dueBadge);
                }

                const recurring = document.createElement('button');
                const recurrence = recurrenceOptions.find(option => option.value === todo.recurrence) || recurrenceOptions[0];
                recurring.className = `recurring-badge${todo.recurrence !== 'once' ? ' is-repeating' : ''}`;
                recurring.title = `${recurrence.title}; click to change`;
                recurring.setAttribute('aria-label', recurring.title);
                recurring.innerHTML = `<i data-lucide="${recurrence.icon}" class="icon"></i>`;
                recurring.addEventListener('click', () => cycleTaskRecurrence(cat, index));
                meta.appendChild(recurring);

                const subtaskToggle = document.createElement('button');
                subtaskToggle.className = 'subtask-toggle';
                subtaskToggle.title = 'Show or hide checklist';
                subtaskToggle.setAttribute('aria-label', `Toggle checklist for ${todo.text}`);
                const subtaskDone = todo.subtasks.filter(subtask => subtask.completed).length;
                subtaskToggle.title = `Checklist: ${subtaskDone}/${todo.subtasks.length} completed`;
                subtaskToggle.innerHTML = '<i data-lucide="list-checks" class="icon"></i>';
                subtaskToggle.addEventListener('click', () => {
                    if (expandedTaskIds.has(todo.id)) expandedTaskIds.delete(todo.id);
                    else expandedTaskIds.add(todo.id);
                    renderTodos();
                });
                meta.appendChild(subtaskToggle);

                const editButton = document.createElement('button');
                editButton.className = 'edit-task-btn';
                editButton.title = 'Edit task';
                editButton.setAttribute('aria-label', `Edit ${todo.text}`);
                editButton.innerHTML = '<i data-lucide="pencil" class="icon"></i>';
                editButton.addEventListener('click', () => openTaskEditor(cat, index));

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-btn';
                deleteButton.title = 'Delete task';
                deleteButton.setAttribute('aria-label', 'Delete task');
                deleteButton.innerHTML = '<i data-lucide="trash-2" class="icon"></i>';
                deleteButton.addEventListener('click', () => deleteTodo(cat, index));

                const subtaskMatchesSearch = taskSearchQuery && todo.subtasks.some(subtask => subtask.text.toLocaleLowerCase().includes(taskSearchQuery));
                li.append(dragHandle, checkbox, content, meta, editButton, deleteButton);
                if (expandedTaskIds.has(todo.id) || subtaskMatchesSearch) {
                    li.appendChild(createSubtaskPanel(cat, index, todo));
                }
                listEl.appendChild(li);
            });
            if (!visibleTasks.length) {
                const empty = document.createElement('li');
                empty.className = todos[cat].length ? 'filtered-empty' : 'category-empty';
                empty.textContent = todos[cat].length ? 'No tasks match this filter.' : 'No tasks yet';
                listEl.appendChild(empty);
            }
            renderCategoryProgress(cat);
        });
        updateProductivityStreak();
        refreshIcons();
    }



    function cycleTaskPriority(cat, index) {
        const sequence = ['high', 'medium', 'low'];
        const [task] = todos[cat].splice(index, 1);
        const current = sequence.indexOf(task.priority);
        task.priority = sequence[(current + 1) % sequence.length];
        const insertionIndex = todos[cat].findIndex(item => priorityRank[item.priority] > priorityRank[task.priority]);
        if (insertionIndex === -1) todos[cat].push(task);
        else todos[cat].splice(insertionIndex, 0, task);
        saveAndRender();
    }

    function cycleTaskRecurrence(cat, index) {
        const task = todos[cat][index];
        const current = recurrenceOptions.findIndex(option => option.value === task.recurrence);
        task.recurrence = recurrenceOptions[(current + 1) % recurrenceOptions.length].value;
        task.scheduleStart = task.dueDate;
        task.completedDates = [];
        saveAndRender();
    }

    function addSubtask(cat, index, rawText) {
        const text = rawText.trim();
        if (!text) return;
        todos[cat][index].subtasks.push({ id: createLocalId(), text, completed: false });
        expandedTaskIds.add(todos[cat][index].id);
        saveAndRender();
    }

    function toggleSubtask(cat, index, subtaskIndex) {
        const subtask = todos[cat][index]?.subtasks[subtaskIndex];
        if (!subtask) return;
        subtask.completed = !subtask.completed;
        expandedTaskIds.add(todos[cat][index].id);
        saveAndRender();
    }

    function deleteSubtask(cat, index, subtaskIndex) {
        if (!todos[cat][index]?.subtasks[subtaskIndex]) return;
        todos[cat][index].subtasks.splice(subtaskIndex, 1);
        expandedTaskIds.add(todos[cat][index].id);
        saveAndRender();
    }

    function toggleTodo(cat, index) {
        todos[cat][index].completed = !todos[cat][index].completed;
        const todo = todos[cat][index];
        if (todo.dueDate && todo.recurrence !== 'once') setOccurrenceCompleted(todo, todo.dueDate, todo.completed);
        saveAndRender();
    }

    function deleteTodo(cat, index) {
        todos[cat].splice(index, 1);
        saveAndRender();
    }

    let editingTaskRef = null;
    function openTaskEditor(cat, index) {
        const todo = todos[cat]?.[index];
        if (!todo) return;
        editingTaskRef = { id: todo.id, cat };
        document.getElementById('editTaskText').value = todo.text;
        document.getElementById('editTaskCategory').value = cat;
        document.getElementById('editTaskPriority').value = todo.priority;
        document.getElementById('editTaskRecurrence').value = todo.recurrence;
        document.getElementById('editTaskDueDate').value = todo.dueDate || '';
        document.getElementById('editTaskCompleted').checked = todo.completed;
        populateTargetSelect(document.getElementById('editTaskTarget'), todo.weeklyTargetId || '');
        document.getElementById('taskEditModal').style.display = 'flex';
        setTimeout(() => document.getElementById('editTaskText').focus(), 0);
    }
    function closeTaskEditor() { document.getElementById('taskEditModal').style.display = 'none'; editingTaskRef = null; }
    function saveTaskEdit() {
        if (!editingTaskRef) return;
        const sourceCat = editingTaskRef.cat;
        const sourceIndex = todos[sourceCat].findIndex(item => item.id === editingTaskRef.id);
        if (sourceIndex < 0) return closeTaskEditor();
        const todo = todos[sourceCat][sourceIndex];
        const previousDue = todo.dueDate;
        const previousRecurrence = todo.recurrence;
        const text = cleanText(document.getElementById('editTaskText').value, 200);
        if (!text) { alert('Task title is required.'); return; }
        const targetCat = document.getElementById('editTaskCategory').value;
        todo.text = text;
        todo.priority = validPriorities.includes(document.getElementById('editTaskPriority').value) ? document.getElementById('editTaskPriority').value : 'medium';
        todo.recurrence = validRecurrences.includes(document.getElementById('editTaskRecurrence').value) ? document.getElementById('editTaskRecurrence').value : 'once';
        const due = document.getElementById('editTaskDueDate').value;
        todo.dueDate = isValidDateKey(due) ? due : '';
        if (todo.dueDate !== previousDue || todo.recurrence !== previousRecurrence) {
            todo.scheduleStart = todo.dueDate;
            todo.completedDates = [];
        }
        todo.completed = document.getElementById('editTaskCompleted').checked;
        todo.weeklyTargetId = document.getElementById('editTaskTarget').value;
        if (targetCat !== sourceCat && categories.includes(targetCat)) { todos[sourceCat].splice(sourceIndex,1); todos[targetCat].push(todo); }
        closeTaskEditor();
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('dashboard_todos', JSON.stringify(todos));
        renderTodos();
        renderCalendar();
        renderObjectives();
    }

    // --- Objectives & Roadmap ---
    const objectivePeriods = ['yearly', 'monthly', 'weekly'];

    function readObjectives() {
        try {
            const stored = JSON.parse(localStorage.getItem('dashboard_objectives'));
            const normalized = {};
            objectivePeriods.forEach(period => {
                normalized[period] = Array.isArray(stored?.[period])
                    ? stored[period].filter(item => item && typeof item.text === 'string').map(item => ({
                        id: typeof item.id === 'string' && item.id ? item.id : createLocalId(),
                        text: cleanText(item.text, 240),
                        completed: Boolean(item.completed),
                        parentId: typeof item.parentId === 'string' ? item.parentId : ''
                    }))
                    : [];
            });
            return normalized;
        } catch {
            return { yearly: [], monthly: [], weekly: [] };
        }
    }

    let objectives = readObjectives();
    let draggedObjective = null;
    const celebratedObjectivePeriods = new Set();
    const animatedObjectiveIds = new Set();
    const expandedGoalBranches = new Set();

    function hierarchyItems(period) {
        const items = new Map();
        readObjectiveArchive().forEach(record => {
            const archivedPeriod = record.type === 'weekly' ? 'weekly' : 'monthly';
            if (archivedPeriod === period) (record.items || []).forEach(item => items.set(item.id, { ...item, archived: true }));
        });
        objectives[period].forEach(item => items.set(item.id, item));
        return [...items.values()];
    }

    function objectivePath(period, id) {
        const item = hierarchyItems(period).find(item => item.id === id);
        if (!item) return '';
        const parentPeriod = period === 'weekly' ? 'monthly' : period === 'monthly' ? 'yearly' : '';
        const parent = parentPeriod && item.parentId ? objectivePath(parentPeriod, item.parentId) : '';
        return [parent, `${item.text}${item.archived ? ' (archived)' : ''}`].filter(Boolean).join(' → ');
    }

    function populateTargetSelect(select, selected = select?.value || '') {
        if (!select) return;
        select.replaceChildren(new Option('No weekly target', ''));
        objectives.weekly.forEach(item => select.add(new Option(objectivePath('weekly', item.id), item.id)));
        if (selected && !objectives.weekly.some(item => item.id === selected)) {
            const path = objectivePath('weekly', selected);
            if (path) select.add(new Option(path, selected));
        }
        select.value = selected;
        if (select.selectedIndex < 0) select.value = '';
    }

    function linkedTasks(period, id) {
        if (period === 'weekly') return categories.flatMap(cat => todos[cat].filter(task => task.weeklyTargetId === id));
        const childPeriod = period === 'yearly' ? 'monthly' : 'weekly';
        return hierarchyItems(childPeriod).filter(child => child.parentId === id).flatMap(child => linkedTasks(childPeriod, child.id));
    }

    let showArchivedGoals = false;
    let objectiveView = 'columns';

    function visibleGoalChildren(period, id) {
        if (period === 'weekly') return [];
        const childPeriod = period === 'yearly' ? 'monthly' : 'weekly';
        return hierarchyItems(childPeriod).filter(child => child.parentId === id && (showArchivedGoals || !child.archived));
    }

    function visibleGoalTasks(period, id) {
        if (period === 'weekly') return linkedTasks(period, id);
        const childPeriod = period === 'yearly' ? 'monthly' : 'weekly';
        return visibleGoalChildren(period, id).flatMap(child => visibleGoalTasks(childPeriod, child.id));
    }

    function goalSummary(period, id) {
        const children = visibleGoalChildren(period, id);
        const tasks = visibleGoalTasks(period, id);
        const parts = [];
        if (period !== 'weekly') {
            const label = period === 'yearly' ? 'monthly objective' : 'weekly target';
            parts.push(`${children.length} ${label}${children.length === 1 ? '' : 's'}`);
        }
        if (tasks.length) parts.push(`${tasks.filter(task => task.completed).length}/${tasks.length} tasks done`);
        else if (period === 'weekly') parts.push('No linked tasks');
        return parts.join(' \u00b7 ');
    }

    function goalDisclosure(period, item, label, keyPrefix = 'branch') {
        const details = document.createElement('details');
        details.className = 'goal-details';
        const key = `${keyPrefix}:${period}:${item.id}`;
        details.open = expandedGoalBranches.has(key);
        const summary = document.createElement('summary');
        summary.textContent = label;
        details.appendChild(summary);
        const populate = () => {
            if (details.children.length === 1) appendGoalBranch(details, period, item.id);
        };
        if (details.open) populate();
        details.addEventListener('toggle', () => {
            if (details.open) { expandedGoalBranches.add(key); populate(); }
            else expandedGoalBranches.delete(key);
        });
        return details;
    }

    function appendGoalBranch(host, period, id) {
        const list = document.createElement('ul');
        list.className = 'goal-branch';
        if (period === 'weekly') {
            categories.forEach(cat => todos[cat].forEach((task, index) => {
                if (task.weeklyTargetId !== id) return;
                const row = document.createElement('li');
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'goal-task-link';
                button.textContent = `${task.completed ? '\u2713' : '\u25cb'} ${task.text}`;
                button.title = 'Edit linked task';
                button.addEventListener('click', () => openTaskEditor(cat, index));
                row.appendChild(button);
                list.appendChild(row);
            }));
        } else {
            const childPeriod = period === 'yearly' ? 'monthly' : 'weekly';
            visibleGoalChildren(period, id).forEach(child => {
                const row = document.createElement('li');
                row.appendChild(goalDisclosure(childPeriod, child,
                    `${child.completed ? '\u2713 ' : ''}${child.text}${child.archived ? ' \u00b7 Archived' : ''} \u2014 ${goalSummary(childPeriod, child.id)}`));
                list.appendChild(row);
            });
        }
        if (!list.children.length) {
            const empty = document.createElement('li');
            empty.textContent = period === 'weekly' ? 'Assign a weekly target in the task editor to link work here.' : `No linked ${period === 'yearly' ? 'monthly objectives' : 'weekly targets'}${showArchivedGoals ? '' : ' in the current period'}.`;
            empty.className = 'goal-branch-empty';
            list.appendChild(empty);
        }
        host.appendChild(list);
    }

    function installGoalToolbar() {
        const section = document.querySelector('.objectives-section');
        if (!section || document.getElementById('goalToolbar')) return;
        const toolbar = document.createElement('div');
        toolbar.id = 'goalToolbar';
        toolbar.className = 'goal-toolbar';
        const select = document.createElement('select');
        select.setAttribute('aria-label', 'Objective view');
        [['columns', 'Columns'], ['grouped', 'Group by parent'], ['roadmap', 'Roadmap']].forEach(([value, label]) => select.add(new Option(label, value)));
        select.addEventListener('change', () => { objectiveView = select.value; renderObjectives(); });
        const label = document.createElement('label');
        const check = document.createElement('input');
        check.type = 'checkbox';
        check.addEventListener('change', () => { showArchivedGoals = check.checked; renderObjectives(); });
        label.append(check, ' Show archived linked work');
        toolbar.append(select, label);
        section.querySelector('.objectives-title').after(toolbar);
        const roadmap = document.createElement('div');
        roadmap.id = 'goalRoadmap';
        roadmap.className = 'goal-roadmap';
        roadmap.hidden = true;
        section.appendChild(roadmap);
    }

    function goalMatchesSearch(period, item) {
        if (!taskSearchQuery || item.text.toLocaleLowerCase().includes(taskSearchQuery)) return true;
        if (period === 'weekly') return visibleGoalTasks(period, item.id).some(task => task.text.toLocaleLowerCase().includes(taskSearchQuery));
        const childPeriod = period === 'yearly' ? 'monthly' : 'weekly';
        return visibleGoalChildren(period, item.id).some(child => goalMatchesSearch(childPeriod, child));
    }

    function renderGoalRoadmap() {
        const host = document.getElementById('goalRoadmap');
        if (!host) return;
        host.replaceChildren();
        host.hidden = objectiveView !== 'roadmap';
        const grid = document.querySelector('.objectives-grid');
        if (grid) grid.hidden = objectiveView === 'roadmap';
        if (host.hidden) return;
        objectivePeriods.forEach(period => {
            const parentPeriod = period === 'monthly' ? 'yearly' : 'monthly';
            hierarchyItems(period).filter(item => goalMatchesSearch(period, item) && (showArchivedGoals || !item.archived) &&
                (period === 'yearly' || !hierarchyItems(parentPeriod).some(parent => parent.id === item.parentId && (showArchivedGoals || !parent.archived))))
                .forEach(item => {
                    const branch = goalDisclosure(period, item, `${period[0].toUpperCase() + period.slice(1)} \u2014 ${item.completed ? '\u2713 ' : ''}${item.text}${item.archived ? ' \u00b7 Archived' : ''} \u2014 ${goalSummary(period, item.id)}`, 'roadmap');
                    host.appendChild(branch);
                });
        });
        if (!host.children.length) host.textContent = taskSearchQuery ? 'No linked objectives match this search.' : 'No objectives yet. Add goals in Columns view.';
    }

    function unlinkObjective(id) {
        objectivePeriods.forEach(period => objectives[period].forEach(item => { if (item.parentId === id) item.parentId = ''; }));
        categories.forEach(cat => todos[cat].forEach(task => { if (task.weeklyTargetId === id) task.weeklyTargetId = ''; }));
        // Preserve archived work while removing references to a deleted or moved parent.
        const archive = readObjectiveArchive();
        archive.forEach(record => (record.items || []).forEach(item => { if (item.parentId === id) item.parentId = ''; }));
        localStorage.setItem('dashboard_objectives_archive', JSON.stringify(archive));
        localStorage.setItem('dashboard_todos', JSON.stringify(todos));
    }

    function currentMonthKey(date = new Date()) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    function currentSundayWeekKey(date = new Date()) {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
        d.setDate(d.getDate() - d.getDay());
        return localDateKey(d);
    }

    function checkWeeklyRollover() {
        const currentKey = currentSundayWeekKey();
        const activeKey = localStorage.getItem('dashboard_objectives_active_week');
        if (!isValidDateKey(activeKey || '')) { localStorage.setItem('dashboard_objectives_active_week', currentKey); return; }
        if (activeKey === currentKey) return;
        if (objectives.weekly.length) {
            const snapshot = objectives.weekly.map(item => ({...item}));
            const archive = readObjectiveArchive();
            archive.push({ type:'weekly', period:activeKey, archivedAt:new Date().toISOString(), completed:snapshot.filter(i=>i.completed).length, total:snapshot.length, items:snapshot });
            localStorage.setItem('dashboard_objectives_archive', JSON.stringify(archive.slice(-120)));
            objectives.weekly = snapshot.filter(item => !item.completed).map(item => ({...item, completed:false}));
            localStorage.setItem('dashboard_objectives', JSON.stringify(objectives));
        }
        localStorage.setItem('dashboard_objectives_active_week', currentKey);
    }

    function formatMonthKey(key) {
        const date = new Date(`${key}-01T12:00:00`);
        return Number.isNaN(date.getTime())
            ? key
            : new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(date);
    }

    function readObjectiveArchive() {
        try {
            const stored = JSON.parse(localStorage.getItem('dashboard_objectives_archive'));
            return Array.isArray(stored) ? stored : [];
        } catch {
            return [];
        }
    }

    function checkMonthlyRollover() {
        const currentKey = currentMonthKey();
        const activeKey = localStorage.getItem('dashboard_objectives_active_month');
        if (!/^\d{4}-\d{2}$/.test(activeKey || '')) {
            localStorage.setItem('dashboard_objectives_active_month', currentKey);
            return;
        }
        if (activeKey === currentKey) return;
        if (!objectives.monthly.length) {
            localStorage.setItem('dashboard_objectives_active_month', currentKey);
            return;
        }

        const completed = objectives.monthly.filter(item => item.completed).length;
        const unfinished = objectives.monthly.length - completed;
        document.getElementById('rolloverHeadingText').textContent = `Start ${formatMonthKey(currentKey).replace(/\s+\d{4}$/, '')}`;
        document.getElementById('rolloverPeriodText').textContent = `Reviewing ${formatMonthKey(activeKey)}`;
        document.getElementById('rolloverCompletedCount').textContent = completed;
        document.getElementById('rolloverUnfinishedCount').textContent = unfinished;
        document.getElementById('monthlyRolloverModal').style.display = 'flex';
        refreshIcons();
        requestAnimationFrame(() => document.querySelector('.rollover-primary')?.focus());
    }

    function completeMonthlyRollover(action) {
        if (action !== 'carry' && action !== 'archive') return;
        const currentKey = currentMonthKey();
        const activeKey = localStorage.getItem('dashboard_objectives_active_month');
        const snapshot = objectives.monthly.map(item => ({ ...item }));
        const archive = readObjectiveArchive().filter(record => !(record?.type !== 'weekly' && record?.period === activeKey));
        archive.push({
            type: 'monthly',
            period: activeKey,
            archivedAt: new Date().toISOString(),
            completed: snapshot.filter(item => item.completed).length,
            total: snapshot.length,
            items: snapshot
        });
        localStorage.setItem('dashboard_objectives_archive', JSON.stringify(archive));

        objectives.monthly = action === 'carry'
            ? snapshot.filter(item => !item.completed).map(item => ({ ...item, completed: false }))
            : [];
        localStorage.setItem('dashboard_objectives_active_month', currentKey);
        document.getElementById('monthlyRolloverModal').style.display = 'none';
        saveObjectives();
    }

    function saveObjectives() {
        localStorage.setItem('dashboard_objectives', JSON.stringify(objectives));
        renderObjectives();
        renderTodos();
        renderCalendar();
    }

    function updateObjectiveTimeAnchors() {
        const now = new Date();
        const monthsLeft = 11 - now.getMonth();
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const daysLeft = lastDayOfMonth - now.getDate();
        document.getElementById('objective-time-yearly').textContent = monthsLeft > 0
            ? `${monthsLeft} ${monthsLeft === 1 ? 'Month' : 'Months'} Left`
            : 'Ends This Month';
        document.getElementById('objective-time-monthly').textContent = daysLeft > 0
            ? `${daysLeft} ${daysLeft === 1 ? 'Day' : 'Days'} Left`
            : 'Ends Today';
        document.getElementById('objective-time-weekly').textContent = now.getDay() === 0
            ? 'Resets Today'
            : 'Resets Sunday';
    }

    function highlightConnectedGoals(period, id) {
        clearGoalHighlights();
        if (!id) return;
        const connected = new Set();
        connected.add(id);

        if (period === 'yearly') {
            const monthlies = (objectives.monthly || []).filter(m => m.parentId === id);
            monthlies.forEach(m => {
                connected.add(m.id);
                const weeklies = (objectives.weekly || []).filter(w => w.parentId === m.id);
                weeklies.forEach(w => connected.add(w.id));
            });
        } else if (period === 'monthly') {
            const item = (objectives.monthly || []).find(m => m.id === id);
            if (item && item.parentId) connected.add(item.parentId);
            const weeklies = (objectives.weekly || []).filter(w => w.parentId === id);
            weeklies.forEach(w => connected.add(w.id));
        } else if (period === 'weekly') {
            const item = (objectives.weekly || []).find(w => w.parentId === id);
            if (item && item.parentId) {
                connected.add(item.parentId);
                const monthlyParent = (objectives.monthly || []).find(m => m.id === item.parentId);
                if (monthlyParent && monthlyParent.parentId) {
                    connected.add(monthlyParent.parentId);
                }
            }
        }

        if (connected.size <= 1) return;

        document.querySelectorAll('.objective-item').forEach(el => {
            const objId = el.dataset.objectiveId;
            if (connected.has(objId)) {
                el.classList.add('goal-connected-active');
            } else {
                el.classList.add('goal-connection-dimmed');
            }
        });
    }

    function clearGoalHighlights() {
        document.querySelectorAll('.objective-item').forEach(el => {
            el.classList.remove('goal-connected-active', 'goal-connection-dimmed');
        });
    }

    function showGoalToast(message) {
        if (typeof document === 'undefined') return;
        let container = document.getElementById('goalToastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'goalToastContainer';
            container.className = 'goal-toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'goal-toast';
        toast.innerHTML = `<i data-lucide="check" class="icon"></i><span>${cleanText(message)}</span>`;
        container.appendChild(toast);
        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons({ root: toast });
        setTimeout(() => {
            toast.classList.add('toast-fade');
            setTimeout(() => toast.remove(), 250);
        }, 2200);
    }

    function openGoalPicker(targetPeriod, currentParentId, onSelect) {
        if (typeof document === 'undefined') return;
        const existing = document.getElementById('goalPickerOverlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'goalPickerOverlay';
        overlay.className = 'goal-picker-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        const card = document.createElement('div');
        card.className = 'goal-picker-card';

        const header = document.createElement('div');
        header.className = 'goal-picker-header';
        const titleText = targetPeriod === 'yearly' ? 'Link to Yearly Goal' : 'Link to Monthly Objective';
        header.innerHTML = `
            <div class="goal-picker-title"><i data-lucide="link" class="icon"></i> <span>${titleText}</span></div>
            <button type="button" class="goal-picker-close" aria-label="Close dialog">&times;</button>
        `;

        const searchWrap = document.createElement('div');
        searchWrap.className = 'goal-picker-search-wrap';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'goal-picker-search';
        searchInput.placeholder = `Search ${targetPeriod} goals...`;
        searchWrap.appendChild(searchInput);

        const list = document.createElement('div');
        list.className = 'goal-picker-list';

        const items = hierarchyItems(targetPeriod).filter(i => showArchivedGoals || !i.archived);

        function renderOptions(filter = '') {
            list.replaceChildren();
            const q = filter.trim().toLowerCase();

            if (currentParentId) {
                const unlinkBtn = document.createElement('button');
                unlinkBtn.type = 'button';
                unlinkBtn.className = 'goal-picker-item goal-picker-unlink';
                unlinkBtn.innerHTML = `<i data-lucide="unlink" class="icon"></i> <span>Unlink (No parent)</span>`;
                unlinkBtn.addEventListener('click', () => {
                    onSelect('');
                    close();
                });
                list.appendChild(unlinkBtn);
            }

            const filtered = items.filter(it => !q || it.text.toLowerCase().includes(q));
            if (!filtered.length) {
                const empty = document.createElement('div');
                empty.className = 'goal-picker-empty';
                empty.textContent = items.length === 0
                    ? `No ${targetPeriod} goals available yet.`
                    : 'No matching goals found.';
                list.appendChild(empty);
                return;
            }

            filtered.forEach(it => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `goal-picker-item${it.id === currentParentId ? ' selected' : ''}`;
                btn.innerHTML = `
                    <span class="goal-picker-bullet ${targetPeriod}"></span>
                    <span class="goal-picker-text">${cleanText(it.text)}</span>
                    ${it.completed ? '<span class="goal-picker-tag done">✓ Done</span>' : ''}
                `;
                btn.addEventListener('click', () => {
                    onSelect(it.id);
                    close();
                });
                list.appendChild(btn);
            });

            if (window.lucide && window.lucide.createIcons) window.lucide.createIcons({ root: list });
        }

        renderOptions();
        searchInput.addEventListener('input', () => renderOptions(searchInput.value));

        function close() {
            overlay.classList.add('closing');
            setTimeout(() => overlay.remove(), 180);
        }

        header.querySelector('.goal-picker-close').addEventListener('click', close);
        overlay.addEventListener('click', e => {
            if (e.target === overlay) close();
        });
        overlay.addEventListener('keydown', e => {
            if (e.key === 'Escape') close();
        });

        card.append(header, searchWrap, list);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons({ root: overlay });

        requestAnimationFrame(() => searchInput.focus());
    }

    function renderObjectives() {
        installGoalToolbar();
        renderGoalRoadmap();
        updateObjectiveTimeAnchors();
        populateTargetSelect(document.getElementById('drawerTaskTarget'));
        objectivePeriods.forEach(period => {
            const list = document.getElementById(`objective-list-${period}`);
            if (!list) return;
            list.replaceChildren();
            const items = objectives[period] || [];
            const completed = items.filter(item => item.completed).length;
            const percentage = items.length ? Math.round((completed / items.length) * 100) : 0;
            const card = list.closest ? list.closest('.objective-card') : null;
            const isComplete = items.length > 0 && percentage === 100;
            if (card) {
                card.classList.toggle('is-complete', isComplete);
                card.classList.remove('just-completed');
                if (isComplete && !celebratedObjectivePeriods.has(period)) {
                    celebratedObjectivePeriods.add(period);
                    requestAnimationFrame(() => card.classList.add('just-completed'));
                } else if (!isComplete) {
                    celebratedObjectivePeriods.delete(period);
                }
            }
            const fill = document.getElementById(`objective-progress-${period}`);
            if (fill) {
                fill.style.width = `${percentage}%`;
                if (fill.parentElement && fill.parentElement.setAttribute) {
                    fill.parentElement.setAttribute('aria-valuenow', String(percentage));
                    fill.parentElement.setAttribute('aria-valuetext', `${completed} of ${items.length} objectives completed`);
                }
            }
            const percentEl = document.getElementById(`objective-percent-${period}`);
            if (percentEl) {
                percentEl.textContent = `${percentage}%`;
                percentEl.title = `${completed}/${items.length} objectives completed`;
            }

            if (!items.length) {
                const empty = document.createElement('li');
                empty.className = 'objective-empty';
                empty.textContent = 'No objectives added yet.';
                list.appendChild(empty);
                return;
            }
            const visibleObjectiveCount = taskSearchQuery
                ? items.filter(item => item.text.toLocaleLowerCase().includes(taskSearchQuery)).length
                : items.length;
            if (!visibleObjectiveCount) {
                const empty = document.createElement('li');
                empty.className = 'objective-empty';
                empty.textContent = 'No objectives match this search.';
                list.appendChild(empty);
                return;
            }

            const orderedItems = items.map((item, index) => ({ item, index }));
            if (objectiveView === 'grouped') orderedItems.sort((a, b) => (a.item.parentId || '').localeCompare(b.item.parentId || ''));
            let previousParent;
            orderedItems.forEach(({ item, index }) => {
                if (taskSearchQuery && !item.text.toLocaleLowerCase().includes(taskSearchQuery)) return;
                if (objectiveView === 'grouped' && period !== 'yearly' && previousParent !== (item.parentId || '')) {
                    previousParent = item.parentId || '';
                    const heading = document.createElement('li');
                    heading.className = 'goal-group-heading';
                    const parentPeriod = period === 'monthly' ? 'yearly' : 'monthly';
                    heading.textContent = objectivePath(parentPeriod, item.parentId) || `No ${parentPeriod} goal linked`;
                    list.appendChild(heading);
                }
                const row = document.createElement('li');
                row.id = `objective-${item.id}`;
                row.tabIndex = -1;
                row.className = `objective-item${item.completed ? ' completed' : ''}${animatedObjectiveIds.has(item.id) ? ' just-checked' : ''}`;
                row.dataset.objectiveItem = 'true';
                row.dataset.objectiveId = item.id;
                row.dataset.objectivePeriod = period;

                // Drag over & drop (support drag-to-link onto parent item)
                row.addEventListener('dragover', event => {
                    if (!draggedObjective) return;
                    event.preventDefault();
                    event.stopPropagation();
                    const isLinkable = (draggedObjective.period === 'monthly' && period === 'yearly') ||
                                       (draggedObjective.period === 'weekly' && period === 'monthly');
                    clearObjectiveDropIndicators();
                    if (isLinkable) {
                        row.classList.add('drop-target-link');
                    } else if (draggedObjective.period === period) {
                        const after = event.clientY > row.getBoundingClientRect().top + row.offsetHeight / 2;
                        row.classList.add(after ? 'drop-after' : 'drop-before');
                        row.dataset.dropAfter = String(after);
                    }
                });
                row.addEventListener('dragleave', () => {
                    row.classList.remove('drop-target-link');
                });
                row.addEventListener('drop', event => {
                    if (!draggedObjective) return;
                    event.preventDefault();
                    event.stopPropagation();
                    const isLinkable = (draggedObjective.period === 'monthly' && period === 'yearly') ||
                                       (draggedObjective.period === 'weekly' && period === 'monthly');
                    if (isLinkable) {
                        const draggedList = objectives[draggedObjective.period];
                        const draggedItem = draggedList ? draggedList[draggedObjective.index] : null;
                        if (draggedItem) {
                            draggedItem.parentId = item.id;
                            saveObjectives();
                            showGoalToast(`Linked "${draggedItem.text}" to "${item.text}"`);
                        }
                    } else if (draggedObjective.period === period) {
                        const targetIndex = index + (row.dataset.dropAfter === 'true' ? 1 : 0);
                        moveObjective(draggedObjective.period, draggedObjective.index, period, targetIndex);
                    }
                    draggedObjective = null;
                    clearObjectiveDropIndicators();
                });

                // Hover connection across columns
                row.addEventListener('mouseenter', () => highlightConnectedGoals(period, item.id));
                row.addEventListener('mouseleave', () => clearGoalHighlights());

                const drag = document.createElement('span');
                drag.className = 'objective-drag';
                drag.draggable = true;
                drag.title = 'Drag to reorder, or drop onto parent goal to link';
                drag.innerHTML = '<i data-lucide="grip-vertical" class="icon"></i>';
                drag.addEventListener('dragstart', event => {
                    draggedObjective = { period, index, id: item.id, text: item.text };
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', `${period}:${index}`);
                    requestAnimationFrame(() => row.classList.add('dragging'));
                });
                drag.addEventListener('dragend', () => {
                    draggedObjective = null;
                    row.classList.remove('dragging');
                    clearObjectiveDropIndicators();
                });

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.completed;
                checkbox.setAttribute('aria-label', `Mark ${item.text} as ${item.completed ? 'incomplete' : 'completed'}`);
                checkbox.addEventListener('change', () => toggleObjective(period, index));

                const content = document.createElement('div');
                content.className = 'objective-content';

                const titleRow = document.createElement('div');
                titleRow.className = 'objective-title-row';

                const text = document.createElement('span');
                text.className = 'objective-text';
                text.textContent = item.text;
                titleRow.appendChild(text);

                // Child count badge
                if (period === 'yearly') {
                    const childCount = (objectives.monthly || []).filter(m => m.parentId === item.id).length;
                    if (childCount > 0) {
                        const badge = document.createElement('span');
                        badge.className = 'objective-linked-pill yearly';
                        badge.title = `${childCount} linked monthly objective${childCount > 1 ? 's' : ''}`;
                        badge.innerHTML = `<i data-lucide="layers" class="chip-icon"></i> <span>${childCount}</span>`;
                        titleRow.appendChild(badge);
                    }
                } else if (period === 'monthly') {
                    const childCount = (objectives.weekly || []).filter(w => w.parentId === item.id).length;
                    if (childCount > 0) {
                        const badge = document.createElement('span');
                        badge.className = 'objective-linked-pill monthly';
                        badge.title = `${childCount} linked weekly target${childCount > 1 ? 's' : ''}`;
                        badge.innerHTML = `<i data-lucide="layers" class="chip-icon"></i> <span>${childCount}</span>`;
                        titleRow.appendChild(badge);
                    }
                }
                content.appendChild(titleRow);

                // Meta row for monthly and weekly items (Parent Chip / Link Button)
                if (period !== 'yearly') {
                    const parentPeriod = period === 'monthly' ? 'yearly' : 'monthly';
                    const parent = hierarchyItems(parentPeriod).find(p => p.id === item.parentId);
                    const metaRow = document.createElement('div');
                    metaRow.className = 'objective-meta-row';

                    if (parent) {
                        const chip = document.createElement('span');
                        chip.className = `objective-parent-chip ${parentPeriod}`;
                        chip.title = `Parent: ${parent.text} (Click to locate)`;

                        const chipIcon = document.createElement('i');
                        chipIcon.setAttribute('data-lucide', 'corner-down-right');
                        chipIcon.className = 'chip-icon';

                        const chipText = document.createElement('span');
                        chipText.className = 'chip-text';
                        chipText.textContent = parent.text;
                        chipText.addEventListener('click', e => {
                            e.stopPropagation();
                            const targetEl = document.getElementById(`objective-${parent.id}`);
                            if (targetEl) {
                                targetEl.scrollIntoView({ behavior: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
                                targetEl.classList.add('goal-pulse');
                                setTimeout(() => targetEl.classList.remove('goal-pulse'), 1200);
                            }
                        });

                        const unlinkBtn = document.createElement('button');
                        unlinkBtn.type = 'button';
                        unlinkBtn.className = 'chip-unlink-btn';
                        unlinkBtn.title = `Unlink from "${parent.text}"`;
                        unlinkBtn.setAttribute('aria-label', `Unlink from ${parent.text}`);
                        unlinkBtn.innerHTML = '&times;';
                        unlinkBtn.addEventListener('click', e => {
                            e.stopPropagation();
                            item.parentId = '';
                            saveObjectives();
                            showGoalToast('Unlinked goal');
                        });

                        chip.append(chipIcon, chipText, unlinkBtn);
                        metaRow.appendChild(chip);
                    } else {
                        const linkBtn = document.createElement('button');
                        linkBtn.type = 'button';
                        linkBtn.className = 'objective-link-btn';
                        linkBtn.title = `Link to ${parentPeriod === 'yearly' ? 'a yearly goal' : 'a monthly objective'}`;
                        linkBtn.innerHTML = `<i data-lucide="link" class="chip-icon"></i> <span>+ Link to ${parentPeriod === 'yearly' ? 'Yearly' : 'Monthly'}</span>`;
                        linkBtn.addEventListener('click', e => {
                            e.stopPropagation();
                            openGoalPicker(parentPeriod, item.parentId, chosenId => {
                                item.parentId = chosenId;
                                saveObjectives();
                                if (chosenId) {
                                    const pItem = hierarchyItems(parentPeriod).find(p => p.id === chosenId);
                                    showGoalToast(`Linked to "${pItem ? pItem.text : 'goal'}"`);
                                }
                            });
                        });
                        metaRow.appendChild(linkBtn);
                    }
                    content.appendChild(metaRow);
                }

                const remove = document.createElement('button');
                remove.className = 'objective-delete';
                remove.title = 'Delete objective';
                remove.setAttribute('aria-label', `Delete objective: ${item.text}`);
                remove.innerHTML = '<i data-lucide="trash-2" class="icon"></i>';
                remove.addEventListener('click', () => deleteObjective(period, index));

                row.append(drag, checkbox, content, remove);
                list.appendChild(row);
            });
        });
        refreshIcons();
        animatedObjectiveIds.clear();
    }

    function addObjective(period) {
        const input = document.getElementById(`objective-input-${period}`);
        const text = input.value.trim();
        if (!text) return;
        objectives[period].push({ id: createLocalId(), text, completed: false });
        input.value = '';
        saveObjectives();
        input.focus();
    }

    function toggleObjective(period, index) {
        const objective = objectives[period]?.[index];
        if (!objective) return;
        if (!objective.completed) animatedObjectiveIds.add(objective.id);
        else animatedObjectiveIds.delete(objective.id);
        objective.completed = !objective.completed;
        saveObjectives();
    }

    function deleteObjective(period, index) {
        if (!objectives[period]?.[index]) return;
        unlinkObjective(objectives[period][index].id);
        objectives[period].splice(index, 1);
        saveObjectives();
    }

    function clearObjectiveDropIndicators() {
        document.querySelectorAll('.objective-item.drop-before, .objective-item.drop-after, .objective-item.drop-target-link')
            .forEach(item => item.classList.remove('drop-before', 'drop-after', 'drop-target-link'));
        document.querySelectorAll('.objective-list.drag-over')
            .forEach(list => list.classList.remove('drag-over'));
    }

    function moveObjective(sourcePeriod, sourceIndex, targetPeriod, targetIndex) {
        if (!objectives[sourcePeriod]?.[sourceIndex] || !objectives[targetPeriod]) return;
        const [moved] = objectives[sourcePeriod].splice(sourceIndex, 1);
        if (sourcePeriod !== targetPeriod) { unlinkObjective(moved.id); moved.parentId = ''; }
        let insertionIndex = targetIndex;
        if (sourcePeriod === targetPeriod && sourceIndex < insertionIndex) insertionIndex--;
        insertionIndex = Math.max(0, Math.min(insertionIndex, objectives[targetPeriod].length));
        objectives[targetPeriod].splice(insertionIndex, 0, moved);
        saveObjectives();
    }

    function installObjectiveDropZones() {
        objectivePeriods.forEach(period => {
            const list = document.getElementById(`objective-list-${period}`);
            list.addEventListener('dragover', event => {
                if (!draggedObjective || event.target.closest('.objective-item')) return;
                event.preventDefault();
                list.classList.add('drag-over');
            });
            list.addEventListener('dragleave', event => {
                if (!list.contains(event.relatedTarget)) list.classList.remove('drag-over');
            });
            list.addEventListener('drop', event => {
                if (!draggedObjective || event.target.closest('.objective-item')) return;
                event.preventDefault();
                moveObjective(draggedObjective.period, draggedObjective.index, period, objectives[period].length);
                draggedObjective = null;
                clearObjectiveDropIndicators();
            });
        });
    }

    function installObjectiveControls() {
        document.querySelectorAll('[data-objective-add]').forEach(button => {
            button.addEventListener('click', () => addObjective(button.dataset.objectiveAdd));
        });
        objectivePeriods.forEach(period => {
            document.getElementById(`objective-input-${period}`).addEventListener('keydown', event => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    addObjective(period);
                }
            });
        });
    }

    // --- Calendar & Scheduling Logic ---
    let calendarDate = new Date();
    let selectedDateKey = localDateKey();
    let calendarViewMode = localStorage.getItem('dashboard_calendar_view') || 'month';
    let showHijri = localStorage.getItem('dashboard_calendar_show_hijri') !== 'false';

    function readCalendarEvents() {
        try {
            const stored = JSON.parse(localStorage.getItem('dashboard_calendar_events'));
            if (!Array.isArray(stored)) return [];
            return stored.filter(event => event && cleanText(event.title) && isValidDateKey(event.date)).map(event => ({
                id: typeof event.id === 'string' && event.id ? event.id : createLocalId(),
                title: cleanText(event.title, 200),
                category: categories.includes(event.category) ? event.category : 'proj',
                date: event.date,
                time: typeof event.time === 'string' && /^([01]\\d|2[0-3]):[0-5]\\d$/.test(event.time) ? event.time : ''
            }));
        } catch { return []; }
    }

    let calendarEvents = readCalendarEvents();

    function saveCalendarEvents() {
        localStorage.setItem('dashboard_calendar_events', JSON.stringify(calendarEvents));
        renderCalendar();
    }

    const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const hijriDayFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        day: 'numeric'
    });
    const hijriMonthFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        month: 'long',
        year: 'numeric'
    });

    function getHijriDetails(dateObj) {
        try {
            const dayStr = hijriDayFormatter.format(dateObj);
            const fullStr = hijriFormatter.format(dateObj);
            const dayNum = parseInt(dayStr, 10);
            return {
                day: dayNum || dayStr,
                full: fullStr,
                isWhiteDay: dayNum === 13 || dayNum === 14 || dayNum === 15
            };
        } catch {
            return { day: '', full: '', isWhiteDay: false };
        }
    }

    function formatShortDate(dateStr) {
        if (!dateStr) return '';
        const today = localDateKey();
        if (dateStr === today) return 'Today';
        const tomorrow = offsetDateKey(today, 1);
        if (dateStr === tomorrow) return 'Tomorrow';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
    }

    function formatDrawerDate(dateStr) {
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return new Intl.DateTimeFormat(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    function installCalendarControls() {
        document.getElementById('calPrevMonth').addEventListener('click', () => {
            if (calendarViewMode === 'month') {
                calendarDate.setMonth(calendarDate.getMonth() - 1);
            } else {
                calendarDate.setDate(calendarDate.getDate() - 7);
            }
            renderCalendar();
        });

        document.getElementById('calNextMonth').addEventListener('click', () => {
            if (calendarViewMode === 'month') {
                calendarDate.setMonth(calendarDate.getMonth() + 1);
            } else {
                calendarDate.setDate(calendarDate.getDate() + 7);
            }
            renderCalendar();
        });

        document.getElementById('calTodayBtn').addEventListener('click', () => {
            calendarDate = new Date();
            selectedDateKey = localDateKey();
            renderCalendar();
        });

        const monthBtn = document.getElementById('calViewMonth');
        const weekBtn = document.getElementById('calViewWeek');

        monthBtn.addEventListener('click', () => {
            calendarViewMode = 'month';
            localStorage.setItem('dashboard_calendar_view', 'month');
            monthBtn.classList.add('active');
            weekBtn.classList.remove('active');
            renderCalendar();
        });

        weekBtn.addEventListener('click', () => {
            calendarViewMode = 'week';
            localStorage.setItem('dashboard_calendar_view', 'week');
            weekBtn.classList.add('active');
            monthBtn.classList.remove('active');
            renderCalendar();
        });

        if (calendarViewMode === 'week') {
            weekBtn.classList.add('active');
            monthBtn.classList.remove('active');
        } else {
            monthBtn.classList.add('active');
            weekBtn.classList.remove('active');
        }

        const hijriBtn = document.getElementById('calToggleHijri');
        hijriBtn.addEventListener('click', () => {
            showHijri = !showHijri;
            localStorage.setItem('dashboard_calendar_show_hijri', String(showHijri));
            hijriBtn.classList.toggle('active', showHijri);
            renderCalendar();
        });
        hijriBtn.classList.toggle('active', showHijri);
    }

    function renderCalendar() {
        renderTodayOverview();
        const grid = document.getElementById('calendarDaysGrid');
        if (!grid) return;
        grid.replaceChildren();

        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();
        const todayKey = localDateKey();

        const monthName = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(calendarDate);
        document.getElementById('calMonthYearLabel').textContent = monthName;

        const hijriMonthEl = document.getElementById('calendarHijriMonth');
        try {
            hijriMonthEl.textContent = showHijri ? hijriMonthFormatter.format(calendarDate) : '';
            hijriMonthEl.style.display = showHijri ? 'inline-block' : 'none';
        } catch {
            hijriMonthEl.style.display = 'none';
        }

        let daysToRender = [];
        if (calendarViewMode === 'month') {
            const firstDayOfMonth = new Date(year, month, 1);
            const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
            const startDate = new Date(year, month, 1 - startDayOfWeek);
            for (let i = 0; i < 42; i++) {
                const cur = new Date(startDate);
                cur.setDate(startDate.getDate() + i);
                daysToRender.push(cur);
                if (i === 34 && cur.getMonth() !== month && cur.getDate() >= 1) {
                    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
                    const lastRendered = daysToRender.find(d => d.getMonth() === month && d.getDate() === lastDayOfMonth);
                    if (lastRendered) break;
                }
            }
        } else {
            const dayOfWeek = (calendarDate.getDay() + 6) % 7;
            const startOfWeek = new Date(calendarDate);
            startOfWeek.setDate(calendarDate.getDate() - dayOfWeek);
            for (let i = 0; i < 7; i++) {
                const cur = new Date(startOfWeek);
                cur.setDate(startOfWeek.getDate() + i);
                daysToRender.push(cur);
            }
        }

        const tasksByDate = {};
        daysToRender.forEach(date => {
            const key = localDateKey(date);
            tasksByDate[key] = categories.flatMap(cat => todos[cat]
                .filter(todo => taskOccursOn(todo, key))
                .map(todo => ({ ...todo, category: cat, completed: taskCompletedOn(todo, key) })));
        });

        const eventsByDate = {};
        calendarEvents.forEach(evt => {
            if (!eventsByDate[evt.date]) eventsByDate[evt.date] = [];
            eventsByDate[evt.date].push(evt);
        });

        const streakDates = new Set(productivityDates);

        daysToRender.forEach(dateObj => {
            const dateKey = localDateKey(dateObj);
            const isCurrentMonth = dateObj.getMonth() === month;
            const isToday = dateKey === todayKey;
            const isSelected = dateKey === selectedDateKey;
            const isStreakDay = streakDates.has(dateKey);

            const cell = document.createElement('div');
            cell.className = `cal-cell${!isCurrentMonth && calendarViewMode === 'month' ? ' other-month' : ''}${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}${isStreakDay ? ' streak-day' : ''}`;
            if (isStreakDay) {
                cell.title = `100% Productivity streak achieved on ${dateKey}`;
            }

            cell.addEventListener('click', () => {
                selectedDateKey = dateKey;
                document.querySelectorAll('.cal-cell.selected').forEach(el => el.classList.remove('selected'));
                cell.classList.add('selected');
                renderDayDrawer();
            });

            const topRow = document.createElement('div');
            topRow.className = 'cal-cell-top';

            const numSpan = document.createElement('span');
            numSpan.className = 'cal-day-num';
            numSpan.textContent = dateObj.getDate();
            topRow.appendChild(numSpan);

            if (showHijri) {
                const hijri = getHijriDetails(dateObj);
                const hijriSpan = document.createElement('span');
                hijriSpan.className = 'cal-hijri-num';
                hijriSpan.textContent = hijri.day;
                hijriSpan.title = hijri.full;
                topRow.appendChild(hijriSpan);
            }
            cell.appendChild(topRow);

            if (showHijri) {
                const badgesWrap = document.createElement('div');
                badgesWrap.className = 'cal-day-badges';
                const dayOfWeek = dateObj.getDay();
                if (dayOfWeek === 5) {
                    const jBadge = document.createElement('span');
                    jBadge.className = 'cal-badge-pill badge-jumuah';
                    jBadge.textContent = 'Jumuʻah';
                    badgesWrap.appendChild(jBadge);
                } else if (dayOfWeek === 1 || dayOfWeek === 4) {
                    const fBadge = document.createElement('span');
                    fBadge.className = 'cal-badge-pill badge-fasting';
                    fBadge.textContent = 'Fasting';
                    fBadge.title = 'Sunnah fasting (Monday / Thursday)';
                    badgesWrap.appendChild(fBadge);
                }
                const hijri = getHijriDetails(dateObj);
                if (hijri.isWhiteDay && dayOfWeek !== 1 && dayOfWeek !== 4) {
                    const wBadge = document.createElement('span');
                    wBadge.className = 'cal-badge-pill badge-fasting';
                    wBadge.textContent = 'White Day';
                    wBadge.title = 'Ayyam al-Beed fasting (13, 14, 15 Hijri)';
                    badgesWrap.appendChild(wBadge);
                }
                if (badgesWrap.children.length > 0) {
                    cell.appendChild(badgesWrap);
                }
            }

            const dayTasks = tasksByDate[dateKey] || [];
            const dayEvents = eventsByDate[dateKey] || [];
            let allDayItems = [
                ...dayTasks.map(t => ({ type: 'task', id: t.id, text: t.text, category: t.category, completed: t.completed })),
                ...dayEvents.map(e => ({ type: 'event', id: e.id, text: e.time ? `${e.time} ${e.title}` : e.title, category: e.category, completed: false }))
            ];
            if (taskSearchQuery) allDayItems = allDayItems.filter(item => item.text.toLocaleLowerCase().includes(taskSearchQuery));

            const eventsList = document.createElement('div');
            eventsList.className = 'cal-events-list';

            ['task', 'event'].forEach(type => {
                const count = allDayItems.filter(item => item.type === type).length;
                if (!count) return;
                const countLabel = document.createElement('div');
                countLabel.className = 'cal-count';
                countLabel.textContent = `${count} ${type}${count === 1 ? '' : 's'}`;
                eventsList.appendChild(countLabel);
            });

            cell.appendChild(eventsList);
            grid.appendChild(cell);
        });

        renderDayDrawer();
        refreshIcons();
    }

    function renderDayDrawer() {
        const drawer = document.getElementById('calendarDayDrawer');
        if (!drawer) return;

        const parts = selectedDateKey.split('-');
        const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

        document.getElementById('drawerGregorianDate').textContent = formatDrawerDate(selectedDateKey);
        const hijriEl = document.getElementById('drawerHijriDate');
        if (showHijri) {
            const hijri = getHijriDetails(dateObj);
            hijriEl.textContent = `${hijri.full} • Islamic Calendar`;
            hijriEl.style.display = 'block';
        } else {
            hijriEl.style.display = 'none';
        }

        const badgesContainer = document.getElementById('drawerSummaryBadges');
        badgesContainer.replaceChildren();
        if (productivityDates.includes(selectedDateKey)) {
            const streakBadge = document.createElement('span');
            streakBadge.className = 'drawer-badge-streak';
            streakBadge.innerHTML = '<i data-lucide="flame" class="icon"></i> 100% Completed Day';
            badgesContainer.appendChild(streakBadge);
        }
        if (selectedDateKey === localDateKey()) {
            const todayBadge = document.createElement('span');
            todayBadge.className = 'drawer-badge-today';
            todayBadge.textContent = 'Today';
            badgesContainer.appendChild(todayBadge);
        }

        // 1. Scheduled Tasks
        const taskListEl = document.getElementById('drawerTaskList');
        taskListEl.replaceChildren();

        const matchingTasks = [];
        categories.forEach(cat => {
            todos[cat].forEach((todo, idx) => {
                if (taskOccursOn(todo, selectedDateKey) && (!taskSearchQuery || todo.text.toLocaleLowerCase().includes(taskSearchQuery) || todo.subtasks.some(subtask => subtask.text.toLocaleLowerCase().includes(taskSearchQuery)))) {
                    matchingTasks.push({ todo, cat, index: idx });
                }
            });
        });

        document.getElementById('drawerTaskCount').textContent = matchingTasks.length;

        if (!matchingTasks.length) {
            const empty = document.createElement('li');
            empty.className = 'drawer-empty-state';
            empty.textContent = 'No tasks scheduled for this day.';
            taskListEl.appendChild(empty);
        } else {
            matchingTasks.forEach(({ todo, cat, index }) => {
                const completed = taskCompletedOn(todo, selectedDateKey);
                const item = document.createElement('li');
                item.className = `drawer-item${completed ? ' completed' : ''}`;

                const chk = document.createElement('input');
                chk.type = 'checkbox';
                chk.checked = completed;
                chk.className = 'task-checkbox';
                chk.setAttribute('aria-label', `Mark task as ${completed ? 'active' : 'completed'}`);
                chk.addEventListener('change', () => {
                    if (todo.recurrence === 'once' || selectedDateKey === todo.dueDate) toggleTodo(cat, index);
                    else {
                        setOccurrenceCompleted(todo, selectedDateKey, chk.checked);
                        saveAndRender();
                    }
                });

                const catBadge = document.createElement('span');
                catBadge.className = `drawer-cat-tag chip-${cat}`;
                catBadge.textContent = cat;

                const textSpan = document.createElement('span');
                textSpan.className = 'drawer-item-title';
                textSpan.textContent = todo.text;
                if (todo.weeklyTargetId) {
                    const path = objectivePath('weekly', todo.weeklyTargetId);
                    if (path) {
                        const breadcrumb = document.createElement('small');
                        breadcrumb.className = 'task-goal-path';
                        breadcrumb.textContent = path;
                        textSpan.appendChild(breadcrumb);
                    }
                }

                const prio = document.createElement('span');
                prio.className = `priority-badge priority-${todo.priority}`;
                prio.textContent = todo.priority;
                const edit = document.createElement('button');
                edit.className = 'edit-task-btn';
                edit.title = 'Edit task';
                edit.innerHTML = '<i data-lucide="pencil" class="icon"></i>';
                edit.addEventListener('click', () => openTaskEditor(cat, index));

                const repeat = document.createElement('span');
                const recurrence = recurrenceOptions.find(option => option.value === todo.recurrence) || recurrenceOptions[0];
                repeat.className = 'drawer-recurrence-icon';
                repeat.title = recurrence.label;
                repeat.setAttribute('role', 'img');
                repeat.setAttribute('aria-label', `Repeat: ${recurrence.label}`);
                repeat.innerHTML = `<i data-lucide="${recurrence.icon}" class="icon" aria-hidden="true"></i>`;
                item.append(chk, textSpan, catBadge, prio, repeat, edit);
                taskListEl.appendChild(item);
            });
        }

        // 2. Events & Milestones
        const eventListEl = document.getElementById('drawerEventList');
        eventListEl.replaceChildren();

        const dayEvents = calendarEvents.filter(e => e.date === selectedDateKey && (!taskSearchQuery || e.title.toLocaleLowerCase().includes(taskSearchQuery)));
        document.getElementById('drawerEventCount').textContent = dayEvents.length;

        if (!dayEvents.length) {
            const empty = document.createElement('li');
            empty.className = 'drawer-empty-state';
            empty.textContent = 'No custom events scheduled.';
            eventListEl.appendChild(empty);
        } else {
            dayEvents.forEach(evt => {
                const item = document.createElement('li');
                item.className = 'drawer-item';

                const catBar = document.createElement('span');
                catBar.className = `drawer-event-bar dot-${evt.category}`;

                const textWrap = document.createElement('div');
                textWrap.className = 'drawer-event-text-wrap';

                const title = document.createElement('span');
                title.className = 'drawer-item-title';
                title.textContent = evt.title;
                textWrap.appendChild(title);

                if (evt.time) {
                    const timeSpan = document.createElement('span');
                    timeSpan.className = 'drawer-event-time';
                    timeSpan.textContent = evt.time;
                    textWrap.appendChild(timeSpan);
                }

                const catBadge = document.createElement('span');
                catBadge.className = `drawer-cat-tag chip-${evt.category}`;
                catBadge.textContent = evt.category;

                const delBtn = document.createElement('button');
                delBtn.className = 'drawer-item-delete';
                delBtn.title = 'Delete event';
                delBtn.setAttribute('aria-label', `Delete event ${evt.title}`);
                delBtn.innerHTML = '<i data-lucide="trash-2" class="icon"></i>';
                delBtn.addEventListener('click', () => {
                    deleteCalendarEvent(evt.id);
                });

                item.append(catBar, textWrap, catBadge, delBtn);
                eventListEl.appendChild(item);
            });
        }

        refreshIcons();
    }

    function addCalendarEvent() {
        const titleInput = document.getElementById('drawerEventTitle');
        const catSelect = document.getElementById('drawerEventCategory');
        const timeInput = document.getElementById('drawerEventTime');
        const title = titleInput.value.trim();
        if (!title || !selectedDateKey) return;

        const newEvent = {
            id: createLocalId(),
            title,
            category: catSelect.value,
            date: selectedDateKey,
            time: timeInput.value || ''
        };
        calendarEvents.push(newEvent);
        titleInput.value = '';
        timeInput.value = '';
        saveCalendarEvents();
    }

    function deleteCalendarEvent(id) {
        calendarEvents = calendarEvents.filter(e => e.id !== id);
        saveCalendarEvents();
    }


    const BACKUP_KEYS = [
        'dashboard_habits',
        'dashboard_todos','dashboard_calendar_events','dashboard_calendar_view','dashboard_calendar_show_hijri',
        'dashboard_objectives','dashboard_objectives_archive','dashboard_objectives_active_month','dashboard_objectives_active_week',
        'productivity_completion_dates','dashboard_last_recurrence_check','nofap_start_date','nofap_streak_history',
        'dashboard_secret_pin_hash','dashboard_schema_version',
        'calisthenics_program_v1','calisthenics_history_v1','calisthenics_active_session_v1',
        'calisthenics_recommendations_v1','calisthenics_readiness_v1','calisthenics_goals_v1','calisthenics_prs_v1'
    ];

    function openDataManager() { document.getElementById('dataManagerModal').style.display='flex'; renderArchiveViewer(); refreshIcons(); }
    function closeDataManager() { document.getElementById('dataManagerModal').style.display='none'; }
    function renderArchiveViewer() {
        const host=document.getElementById('archiveViewer'); host.replaceChildren();
        const records=readObjectiveArchive().slice().reverse();
        if(!records.length){ host.textContent='No archived objective periods yet.'; return; }
        records.forEach(record=>{
            const box=document.createElement('div'); box.className='archive-group';
            const title=document.createElement('strong'); title.textContent=`${record.type==='weekly'?'Week':'Month'} · ${record.period || 'Unknown period'} · ${record.completed||0}/${record.total||0} completed`;
            const date=document.createElement('small'); date.textContent=record.archivedAt ? `Archived ${new Date(record.archivedAt).toLocaleString()}` : '';
            const items=document.createElement('div'); items.className='archive-items'; items.textContent=Array.isArray(record.items)&&record.items.length ? record.items.map(i=>`${i.completed?'✓':'○'} ${i.text}`).join('  ·  ') : 'No items';
            box.append(title,date,items); host.appendChild(box);
        });
    }
    function exportDashboardBackup() {
        const data={ app:'workspace-dashboard', schemaVersion:DASHBOARD_SCHEMA_VERSION, exportedAt:new Date().toISOString(), storage:{} };
        BACKUP_KEYS.forEach(key=>{ const value=localStorage.getItem(key); if(value!==null) data.storage[key]=value; });
        const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
        const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`workspace-backup-${localDateKey()}.json`; a.click(); URL.revokeObjectURL(url);
    }
    const JSON_BACKUP_KEYS = new Set(['dashboard_habits','dashboard_todos','dashboard_calendar_events','dashboard_objectives','dashboard_objectives_archive','productivity_completion_dates','nofap_streak_history','calisthenics_program_v1','calisthenics_history_v1','calisthenics_active_session_v1','calisthenics_recommendations_v1','calisthenics_readiness_v1','calisthenics_goals_v1','calisthenics_prs_v1']);
    function isSafeBackup(data){
        if (!(data && data.app==='workspace-dashboard' && data.storage && typeof data.storage==='object')) return false;
        for (const [key,value] of Object.entries(data.storage)) {
            if (!BACKUP_KEYS.includes(key) || typeof value !== 'string') continue;
            if (JSON_BACKUP_KEYS.has(key)) { try { JSON.parse(value); } catch { return false; } }
        }
        return true;
    }
    async function importDashboardBackup(event) {
        const file=event.target.files?.[0]; event.target.value=''; if(!file) return;
        try {
            const data=JSON.parse(await file.text());
            if(!isSafeBackup(data)) throw new Error('Not a valid Workspace Dashboard backup.');
            const before={}; BACKUP_KEYS.forEach(k=>{const v=localStorage.getItem(k); if(v!==null) before[k]=v;});
            localStorage.setItem('dashboard_preimport_backup',JSON.stringify({createdAt:new Date().toISOString(),storage:before}));
            BACKUP_KEYS.forEach(key=>{ if(Object.prototype.hasOwnProperty.call(data.storage,key) && typeof data.storage[key]==='string') localStorage.setItem(key,data.storage[key]); });
            alert('Backup imported successfully. The app will reload now.'); location.reload();
        } catch(error) { alert(`Import failed: ${error.message}`); }
    }

    installSearchAndFilters();
    window.addEventListener('storage', event => {
        if (event.key !== 'dashboard_todos' && event.key !== 'productivity_completion_dates' && event.key !== null) return;
        todos = readTodos();
        categories.forEach(cat => { if (!Array.isArray(todos[cat])) todos[cat] = []; });
        productivityDates = readProductivityDates();
        resetRecurringTasksIfNeeded();
        renderTodos();
        renderCalendar();
        renderObjectives();
    });
    installDropZones();
    resetRecurringTasksIfNeeded();
    renderTodos();
    installObjectiveControls();
    installObjectiveDropZones();
    checkWeeklyRollover();
    renderObjectives();
    checkMonthlyRollover();
    scheduleMidnightReset();
    installCalendarControls();
    renderCalendar();
    setInterval(() => { if (!document.hidden) renderTodayOverview(); }, 60000);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            if (resetRecurringTasksIfNeeded()) renderTodos();
            updateObjectiveTimeAnchors();
            checkWeeklyRollover();
            checkMonthlyRollover();
            renderObjectives();
            renderCalendar();
        }
    });
    updateCounter();
    const resetStreakBtn = document.getElementById('resetStreakBtn');
    if (resetStreakBtn) {
        resetStreakBtn.addEventListener('click', resetCounter);
    }

    // PWA service worker (requires HTTPS or localhost; file:// is intentionally skipped).
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(error => {
                console.warn('Service worker registration failed:', error);
            });
        });
    }
