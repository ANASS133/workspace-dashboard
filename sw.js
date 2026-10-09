const CACHE_NAME = 'workspace-dashboard-v22';
const LUCIDE_URL = 'https://unpkg.com/lucide@1.33.0/dist/umd/lucide.min.js';
const APP_SHELL = [
  './assets/habits.js?v=2',
  './',
  './index.html',
  './godseeyou.html',
  './today.html',
  './training.html',
  './study.html',
  './assets/today.css?v=2',
  './assets/today.js?v=2',
  './assets/training.css?v=6',
  './assets/training.js?v=6',
  './assets/study.css?v=2',
  './assets/study.js?v=3',
  './assets/curriculum-data.js?v=1',
  './assets/task-schedule.js?v=2',
  './assets/supabase-sync.js?v=1',
  './assets/styles.css?v=2',
  './assets/app.js?v=4',
  './manifest.webmanifest',
  './icons/app-icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        await cache.addAll(APP_SHELL);
        try {
          const request = new Request(LUCIDE_URL, { mode: 'no-cors' });
          const response = await fetch(request);
          await cache.put(request, response);
        } catch (_) {
          // The core app must still install if the icon CDN is temporarily unavailable.
        }
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  const sameOrigin = requestUrl.origin === self.location.origin;

  // Network-first for local files: fresh edits appear immediately; cache remains the offline fallback.
  if (sameOrigin) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          if (event.request.mode === 'navigate') return caches.match('./index.html');
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }

  // Cross-origin dependency (Lucide): cache-first once it has been cached during install.
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
      .catch(() => new Response('Offline', { status: 503, statusText: 'Offline' }))
  );
});

// Background Sync for offline pushes when connectivity returns
self.addEventListener('sync', event => {
  if (event.tag === 'supabase-sync-queue') {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'FLUSH_OFFLINE_QUEUE' }));
      })
    );
  }
});

