const fs = require('fs');

const scheduleCode = fs.readFileSync('assets/task-schedule.js', 'utf8');
const appCode = fs.readFileSync('assets/app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

// Build a DOM tree from index.html or mock it thoroughly
const elements = new Map();

function createMockEl(tag = 'div', id = '') {
    const el = {
        id,
        tagName: tag.toUpperCase(),
        style: {},
        dataset: {},
        classList: {
            _classes: new Set(),
            add: function(...cls) { cls.forEach(c => this._classes.add(c)); },
            remove: function(...cls) { cls.forEach(c => this._classes.delete(c)); },
            toggle: function(c, force) {
                if (force !== undefined) {
                    if (force) this._classes.add(c); else this._classes.delete(c);
                    return force;
                }
                const has = this._classes.has(c);
                if (has) this._classes.delete(c); else this._classes.add(c);
                return !has;
            },
            contains: function(c) { return this._classes.has(c); }
        },
        children: [],
        parentElement: null,
        replaceChildren: function(...args) {
            this.children = [];
            for (const a of args) this.appendChild(a);
        },
        appendChild: function(c) {
            if (c) {
                c.parentElement = this;
                this.children.push(c);
            }
            return c;
        },
        append: function(...args) {
            args.forEach(a => {
                if (typeof a === 'string') {
                    // text node
                } else if (a) {
                    this.appendChild(a);
                }
            });
        },
        setAttribute: function(k, v) { this[k] = v; },
        getAttribute: function(k) { return this[k] || null; },
        removeAttribute: function(k) { delete this[k]; },
        remove: function() {
            if (this.parentElement) {
                const idx = this.parentElement.children.indexOf(this);
                if (idx !== -1) this.parentElement.children.splice(idx, 1);
            }
        },
        addEventListener: () => {},
        removeEventListener: () => {},
        focus: () => {},
        click: () => {},
        querySelectorAll: function(sel) {
            const results = [];
            const walk = (node) => {
                for (const child of node.children) {
                    if (sel.startsWith('.') && child.classList.contains(sel.slice(1))) results.push(child);
                    else if (sel.startsWith('#') && child.id === sel.slice(1)) results.push(child);
                    walk(child);
                }
            };
            walk(this);
            return results;
        },
        querySelector: function(sel) {
            return this.querySelectorAll(sel)[0] || null;
        }
    };
    return el;
}

const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
for (const id of idMatches) {
    elements.set(id, createMockEl('div', id));
}

// Make sure category lists have a parent and card-header as in index.html
['lang', 'cyber', 'train', 'din', 'work', 'proj'].forEach(cat => {
    const card = createMockEl('div', `card-${cat}`);
    const header = createMockEl('div');
    header.classList.add('card-header');
    header.classList.add(`c-${cat}`);
    const list = elements.get(`list-${cat}`) || createMockEl('ul', `list-${cat}`);
    card.appendChild(header);
    card.appendChild(list);
    elements.set(`list-${cat}`, list);
});

global.window = {
    lucide: {
        createIcons: () => {
            console.log('PASS: window.lucide.createIcons called successfully!');
        }
    },
    addEventListener: () => {},
    localStorage: {
        _store: {},
        getItem: function(k) { return this._store[k] || null; },
        setItem: function(k, v) { this._store[k] = String(v); },
        removeItem: function(k) { delete this._store[k]; }
    },
    location: { reload: () => {}, protocol: 'http:', hostname: 'localhost' },
    setInterval: () => {},
    setTimeout: () => {}
};

global.document = {
    getElementById: (id) => {
        if (!elements.has(id)) {
            elements.set(id, createMockEl('div', id));
        }
        return elements.get(id);
    },
    createElement: (tag) => createMockEl(tag),
    querySelectorAll: (sel) => {
        const results = [];
        for (const el of elements.values()) {
            if (sel.startsWith('.') && el.classList.contains(sel.slice(1))) results.push(el);
            else if (sel.startsWith('#') && el.id === sel.slice(1)) results.push(el);
        }
        return results;
    },
    querySelector: (sel) => {
        for (const el of elements.values()) {
            if (sel.startsWith('.') && el.classList.contains(sel.slice(1))) return el;
            else if (sel.startsWith('#') && el.id === sel.slice(1)) return el;
        }
        return null;
    },
    addEventListener: () => {},
    body: createMockEl('body'),
    hidden: false
};

global.Option = function(text, val) { return { text, value: val }; };
global.localStorage = global.window.localStorage;
global.location = global.window.location;
global.setInterval = global.window.setInterval;
global.setTimeout = global.window.setTimeout;
global.navigator = { serviceWorker: { register: () => Promise.resolve() } };

try {
    eval(scheduleCode + '\n' + appCode);
    console.log('SUCCESS: Full app initialization completed without any error!');
    
    // Check if calendar days grid was populated!
    const calGrid = document.getElementById('calendarDaysGrid');
    console.log(`Calendar days rendered: ${calGrid.children.length} days`);

    // Check if resetCounter exists on window
    console.log('window.resetCounter is a function:', typeof window.resetCounter === 'function');
    
    // Test invoking resetCounter
    window.resetCounter();
    console.log('resetCounter() executed without crashing!');
} catch (err) {
    console.error('FAIL: App initialization failed:', err);
    process.exit(1);
}
