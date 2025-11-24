const CACHE_NAME = 'arcane-codex-v6-flat'; 
const ASSETS = [
  './',
  './index.html',
  './spells.js',
  './items.js',
  './manifest.json',
  // The External Engine (Must match HTML exactly)
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com'
];

// 1. INSTALL: Cache EVERYTHING
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
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
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// 3. FETCH: Cache First Strategy
self.addEventListener('fetch', (e) => {
  // Ignore Google API
  if (e.request.url.includes('googleapis') || e.request.url.includes('accounts.google')) return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});