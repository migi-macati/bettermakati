const CACHE = 'bettermakati-civic-v2';
// All client-side routes share Vite's index.html. A single cached shell handles
// offline navigation without six extra CDN requests during installation.
const CORE = ['/', '/offline.html'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(CORE.map(url => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith('bettermakati-') && key !== CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    // Prefer a fresh page when online. When offline, the cached SPA shell
    // renders any route without storing redundant copies of index.html.
    event.respondWith(
      fetch(request).catch(async () =>
        (await caches.match('/')) || caches.match('/offline.html')
      )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok && ['script', 'style', 'font', 'image'].includes(request.destination)) {
          const copy = response.clone();
          event.waitUntil(
            caches.open(CACHE).then(cache => cache.put(request, copy))
          );
        }
        return response;
      });
    })
  );
});
