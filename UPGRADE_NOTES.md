# Workspace Dashboard — Maintenance Upgrade

## Fixed
- Productivity streak now evaluates tasks due today plus active daily habits instead of every task in the workspace.
- Recurring task dates advance safely for daily, weekly, and monthly recurrences, including missed days/weeks/months.
- Weekly objectives now roll over on Sunday: the previous week is archived and unfinished targets carry forward as incomplete.
- Monthly and weekly objective archives can be viewed from the Data & Backups panel.
- Full task editing: title, category, priority, recurrence, due date, and completion state.
- Search now covers tasks, subtasks, objectives, and calendar events.
- Export/import JSON backups with validation and a pre-import safety snapshot.
- Secret area no longer contains a plaintext hard-coded `1234` PIN. The user creates a PIN on first access; it is stored as a hash (with a local fallback when Web Crypto is unavailable).
- `index.html` and `godseeyou.html` now share `assets/app.js` and `assets/styles.css`, so application logic/styles are maintained once.
- `godseeyou.html` remains a functional legacy entry rather than a redirect to preserve `file://` localStorage compatibility for the existing Windows shortcut.
- Removed confirmed dead CSS from old task-composer UI.
- Pinned the Lucide dependency and updated service-worker caching. Local files use network-first with offline fallback to avoid stale development builds.

## Data compatibility
Existing localStorage keys are preserved. The upgrade normalizes old task/objective/event data on load. Historical productivity dates are left untouched because old historical task state is not available to reconstruct them safely.

## Important
The first time you open the private area after this upgrade, create a new PIN. The old source-code PIN `1234` is intentionally not migrated.
