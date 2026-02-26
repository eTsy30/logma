/// <reference lib="webworker" />

const CACHE_NAME = 'logma-cache-v1';
const STATIC_CACHE = 'logma-static-v1';
const API_CACHE = 'logma-api-v1';

const STATIC_ASSETS = ['/', '/favicon.ico', '/favicon.svg', '/NewLogo.svg'];

// Установка Service Worker и кэширование статических файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Кэширование статических файлов');
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  self.skipWaiting();
});

// Активация - очистка старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name.startsWith('logma-') &&
              name !== STATIC_CACHE &&
              name !== API_CACHE
            );
          })
          .map((name) => {
            console.log('[SW] Удаление старого кэша:', name);
            return caches.delete(name);
          }),
      );
    }),
  );
  self.clients.claim();
});

// Перехват сетевых запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем не-GET запросы
  if (request.method !== 'GET') {
    return;
  }

  // API-запросы - стратегия Network First с кэшированием
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // Статические файлы - стратегия Cache First
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Навигационные запросы - Network First
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // По умолчанию - Network First
  event.respondWith(networkFirstStrategy(request, STATIC_CACHE));
});

// Стратегия Cache First - сначала кэш, потом сеть
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache First - ошибка сети:', error);
    return new Response('Нет подключения к интернету', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// Стратегия Network First - сначала сеть, потом кэш
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network First - ошибка сети, пробуем кэш:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Для навигационных запросов возвращаем кэшированную главную страницу
    if (request.mode === 'navigate') {
      const cachedIndex = await caches.match('/');
      if (cachedIndex) {
        return cachedIndex;
      }
    }

    return new Response('Нет подключения к интернету', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// ========== PUSH УВЕДОМЛЕНИЯ ==========

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
  console.log('[SW] Получено push-уведомление');

  let data = {
    title: 'Новый фильм дня!',
    body: 'Проверьте новый фильм дня',
    icon: '/favicon.svg',
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.log('[SW] Ошибка парсинга данных push:', e);
    }
  }

  const options = {
    body: data.body || 'Фильм дня обновился!',
    icon: data.icon || '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
    },
    actions: [
      { action: 'open', title: 'Открыть' },
      { action: 'close', title: 'Закрыть' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Новый фильм дня!',
      options,
    ),
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Клик по уведомлению:', event.action);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Проверяем, есть ли уже открытое окно
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Открываем новое окно, если нет существующего
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
