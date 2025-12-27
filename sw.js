const CACHE_NAME = 'gestion-pro-v2';
const STATIC_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore requests that are not http/https (chrome-extension, etc)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 1. Navigation (HTML): Network first, then fallback to cache (offline mode)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 2. Static Assets (JS, CSS, Fonts, Images): Stale-While-Revalidate
  // We serve from cache immediately, but update cache in background
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    request.destination === 'image' ||
    STATIC_URLS.includes(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        const fetchPromise = fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              // Only cache if request is http/https
              if (request.url.startsWith('http')) {
                cache.put(request, responseToCache);
              }
            });
          }
          return networkResponse;
        }).catch(() => {/* Ignore network errors for background updates */ });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. API/Others: Network only (default)
  // For Supabase/API we usually don't want to aggressively cache GETs unless using specific library logic
  // So we let them fall through to network.
});