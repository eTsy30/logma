// // Утилита для работы с Web Push уведомлениями

// const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

// export interface PushSubscriptionData {
//   endpoint: string;
//   keys: {
//     p256dh: string;
//     auth: string;
//   };
// }

// /**
//  * Запросить разрешение на отправку уведомлений
//  */
// export async function requestNotificationPermission(): Promise<NotificationPermission> {
//   if (!('Notification' in window)) {
//     console.warn('Push-уведомления не поддерживаются в этом браузере');
//     return 'denied';
//   }

//   if (Notification.permission === 'granted') {
//     return 'granted';
//   }

//   if (Notification.permission === 'denied') {
//     return 'denied';
//   }

//   const permission = await Notification.requestPermission();
//   console.log('[Push] Разрешение на уведомления:', permission);
//   return permission;
// }

// /**
//  * Подписаться на push-уведомления
//  */
// export async function subscribeToPush(): Promise<PushSubscription | null> {
//   if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
//     console.warn('[Push] Push-уведомления не поддерживаются');
//     return null;
//   }

//   try {
//     const registration = await navigator.serviceWorker.ready;

//     // Проверяем, уже есть ли подписка
//     const existingSubscription =
//       await registration.pushManager.getSubscription();
//     if (existingSubscription) {
//       console.log('[Push] Уже подписаны на уведомления');
//       return existingSubscription;
//     }

//     // Создаём новую подписку
//     const subscription = await registration.pushManager.subscribe({
//       userVisibleOnly: true,
//       applicationServerKey: VAPID_PUBLIC_KEY
//         ? urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
//         : undefined,
//     });

//     console.log('[Push] Подписка создана:', subscription);
//     return subscription;
//   } catch (error) {
//     console.error('[Push] Ошибка подписки на уведомления:', error);
//     return null;
//   }
// }

// /**
//  * Отписаться от push-уведомлений
//  */
// export async function unsubscribeFromPush(): Promise<boolean> {
//   if (!('serviceWorker' in navigator)) {
//     return false;
//   }

//   try {
//     const registration = await navigator.serviceWorker.ready;
//     const subscription = await registration.pushManager.getSubscription();

//     if (subscription) {
//       await subscription.unsubscribe();
//       console.log('[Push] Отписались от уведомлений');
//       return true;
//     }

//     return false;
//   } catch (error) {
//     console.error('[Push] Ошибка отписки:', error);
//     return false;
//   }
// }

// /**
//  * Отправить подписку на сервер
//  */
// export async function sendSubscriptionToServer(
//   subscription: PushSubscription,
// ): Promise<boolean> {
//   try {
//     const subscriptionData = subscription.toJSON() as PushSubscriptionData;

//     await fetch('/api/push/subscribe', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(subscriptionData),
//     });

//     console.log('[Push] Подписка отправлена на сервер');
//     return true;
//   } catch (error) {
//     console.error('[Push] Ошибка отправки подписки на сервер:', error);
//     return false;
//   }
// }

// /**
//  * Показать тестовое уведомление
//  */
// export async function showTestNotification(): Promise<void> {
//   const permission = await requestNotificationPermission();

//   if (permission !== 'granted') {
//     console.warn('[Push] Нет разрешения на уведомления');
//     return;
//   }

//   if (!('serviceWorker' in navigator)) {
//     console.warn('[Push] Service Worker не поддерживается');
//     return;
//   }

//   try {
//     const registration = await navigator.serviceWorker.ready;

//     await registration.showNotification('Тестовое уведомление!', {
//       body: 'Push-уведомления работают корректно',
//       icon: '/favicon.svg',
//       badge: '/favicon.svg',
//     });

//     console.log('[Push] Тестовое уведомление показано');
//   } catch (error) {
//     console.error('[Push] Ошибка показа уведомления:', error);
//   }
// }

// /**
//  * Конвертировать VAPID ключ из base64 в Uint8Array
//  */
// function urlBase64ToUint8Array(base64String: string): Uint8Array {
//   const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }

//   return outputArray;
// }

// /**
//  * Проверить поддержку push-уведомлений
//  */
// export function isPushSupported(): boolean {
//   return (
//     'Notification' in window &&
//     'serviceWorker' in navigator &&
//     'PushManager' in window
//   );
// }
