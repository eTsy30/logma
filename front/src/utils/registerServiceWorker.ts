export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.register('/sw.js').then((registration) => {
    registration.onupdatefound = () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.onstatechange = () => {
        if (
          newWorker.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          window.location.reload();
        }
      };
    };
  });
}
