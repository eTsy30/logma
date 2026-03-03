'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLazyGetMeQuery } from 'redux/auth/api';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { hydrateAuth } from 'redux/auth/slice'; // ← импортируем
import Loading from '@/app/loading';

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
  const dispatch = useAppDispatch(); // ← добавляем
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname?.startsWith(path));
  const isResetPassword = pathname?.startsWith('/reset-password');

  // 🔥 Гидратация при монтировании (только на клиенте)
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isPublicPath && !isResetPassword) {
      setIsReady(true);
      return;
    }

    if (isInitialized) {
      setIsReady(true);
    }
  }, [isInitialized, isPublicPath, isResetPassword]);

  useEffect(() => {
    // 🔥 Вызываем getMe только после гидратации или если нет токена
    if (!isInitialized) {
      const token = localStorage.getItem('accessToken');
      // Если токен есть в localStorage — getMe его использует через prepareHeaders
      // Если нет — всё равно вызываем для установки isInitialized
      getMe();
    }
  }, [isInitialized, getMe]);

  useEffect(() => {
    if (!isReady) return;

    if (isAuthenticated && isPublicPath && !isResetPassword) {
      router.replace('/dashboard');
    } else if (!isAuthenticated && !isPublicPath) {
      router.replace('/login');
    }
  }, [isReady, isAuthenticated, isPublicPath, isResetPassword, router]);

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
        <Loading />
      </div>
    );
  }

  return children;
}
