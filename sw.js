const CACHE_NAME = 'arcane-codex-v2'; // Changed version to force update
const ASSETS = [
  './',
  './index.html',
  './spells.js',
  './items.js',
  './manifest.json',
  // EXTERNAL LIBRARIES (The Engine)
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com'
];

// Install: Cache everything
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Force activation
});

// Activate: Clean up old caches
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

// Fetch: Network First, Fallback to Cache (Better for dynamic data)
self.addEventListener('fetch', (e) => {
  // Skip Google API requests (they require online)
  if (e.request.url.includes('googleapis') || e.request.url.includes('accounts.google')) {
    return; 
  }

  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match(e.request))
  );
});
