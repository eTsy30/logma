/// <reference lib="webworker" />

const CACHE_VERSION = 'v3';
const STATIC_CACHE = `logma-static-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/favicon.ico',
  '/favicon.svg',
  '/NewLogo.svg',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      // Кэшируем по одному, чтобы один 404 не ломал всё
      const promises = STATIC_ASSETS.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
            console.log('[SW] Cached:', url);
          } else {
            console.warn('[SW] Failed to cache (404):', url);
          }
        } catch (error) {
          console.warn('[SW] Failed to cache:', url, error);
        }
      });

      await Promise.all(promises);
    }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key.startsWith('logma-') && key !== STATIC_CACHE)
              .map((key) => caches.delete(key)),
          ),
        ),
    ]),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/auth'))
    return;

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Если нет сети и нет в кэше — возвращаем 404
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback на dashboard
    const fallback = await caches.match('/dashboard');
    if (fallback) return fallback;

    return new Response('Offline', { status: 503 });
  }
}
