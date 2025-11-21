const CACHE_NAME = 'arcane-codex-v3'; // New version
const ASSETS = [
  './',
  './index.html',
  './spells.js',
  './items.js',
  './manifest.json',
  // The Engine (External Libraries)
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com'
];

// 1. INSTALL: Cache EVERYTHING immediately
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force new worker to take over
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching Files');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. ACTIVATE: Clean up old versions
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. FETCH: Cache First Strategy (Offline Priority)
self.addEventListener('fetch', (e) => {
  // Ignore Google API calls (they require internet)
  if (e.request.url.includes('googleapis') || e.request.url.includes('accounts.google')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // A. If found in cache, return it immediately (OFFLINE WORKS)
      if (cachedResponse) {
        return cachedResponse;
      }
      // B. If not in cache, try to fetch from network
      return fetch(e.request);
    })
  );
});
