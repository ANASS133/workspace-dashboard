// Shared calendar and Today task scheduling.
    function localDateKey(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function offsetDateKey(key, dayOffset) {
        const date = new Date(`${key}T12:00:00`);
        date.setDate(date.getDate() + dayOffset);
        return localDateKey(date);
    }

    function addMonthsClamped(date, months) {
        const originalDay = date.getDate();
        const target = new Date(date.getFullYear(), date.getMonth() + months, 1, 12);
        const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
        target.setDate(Math.min(originalDay, lastDay));
        return target;
    }

    function taskOccursOn(todo, key) {
        if (!todo.dueDate) return false;
        if (todo.recurrence === 'once') return key === todo.dueDate;
        const start = todo.scheduleStart || todo.dueDate;
        if (key < start) return false;
        if (todo.recurrence === 'habit') return true;
        const anchor = new Date(`${start}T12:00:00`);
        const date = new Date(`${key}T12:00:00`);
        if (todo.recurrence === 'weekly') return anchor.getDay() === date.getDay();
        if (todo.recurrence === 'monthly') {
            const months = (date.getFullYear() - anchor.getFullYear()) * 12 + date.getMonth() - anchor.getMonth();
            return localDateKey(addMonthsClamped(anchor, months)) === key;
        }
        return key === todo.dueDate;
    }

    function taskCompletedOn(todo, key) {
        return todo.recurrence === 'once' || key === todo.dueDate
            ? todo.completed : (todo.completedDates || []).includes(key);
    }

    function setOccurrenceCompleted(todo, key, completed) {
        todo.completedDates = (todo.completedDates || []).filter(date => date !== key);
        if (completed) todo.completedDates.push(key);
        todo.updatedAt = Date.now();
    }
