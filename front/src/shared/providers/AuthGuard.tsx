'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLazyGetMeQuery } from 'redux/auth/api';
import { useAppSelector } from 'redux/store';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/color',
  '/registration',
  '/forgot-password',
  '/reset-password',
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAppSelector((s) => s.auth);
  const [getMe] = useLazyGetMeQuery();
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname?.startsWith(path));
  const isResetPassword = pathname?.startsWith('/reset-password');

  // Инициализация
  useEffect(() => {
    // На публичных путях (кроме reset-password) сразу готовы
    if (isPublicPath && !isResetPassword) {
      setIsReady(true);
      return;
    }

    // Для приватных путей и reset-password ждем Redux
    if (isInitialized) {
      setIsReady(true);
    }
  }, [isInitialized, isPublicPath, isResetPassword]);

  // Запрос пользователя (только если есть токен)
  useEffect(() => {
    if (!isInitialized) {
      getMe();
    }
  }, [isInitialized, getMe]);

  // Редиректы
  useEffect(() => {
    if (!isReady) return;

    if (isAuthenticated && isPublicPath && !isResetPassword) {
      router.replace('/dashboard');
    } else if (!isAuthenticated && !isPublicPath) {
      router.replace('/login');
    }
  }, [isReady, isAuthenticated, isPublicPath, isResetPassword, router]);

  // Лоадер только для приватных путей
  if (!isReady && !isPublicPath) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Загрузка...</div>
      </div>
    );
  }

  return children;
}
