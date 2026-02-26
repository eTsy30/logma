export function registerServiceWorker(): void {
  if (typeof window === 'undefined') {
    return;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('[SW] Service Worker зарегистрирован:', registration.scope);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                console.log('[SW] Доступна новая версия. Обновите страницу.');
              }
            });
          }
        });
      } catch (error) {
        console.error('[SW] Ошибка регистрации Service Worker:', error);
      }
    });
  } else {
    console.warn('[SW] Service Worker не поддерживается в этом браузере');
  }
}

export function unregisterServiceWorker(): void {
  if (typeof window === 'undefined') {
    return;
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('[SW] Ошибка отмены регистрации:', error);
      });
  }
}
