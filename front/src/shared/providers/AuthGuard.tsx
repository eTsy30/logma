'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLazyGetMeQuery } from 'redux/auth/api';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { hydrateAuth } from 'redux/auth/slice';
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
  const [getMe, { isLoading: isGetMeLoading }] = useLazyGetMeQuery();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [hydrationDone, setHydrationDone] = useState(false);

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname?.startsWith(path));
  const isResetPassword = pathname?.startsWith('/reset-password');

  // Гидратация при монтировании (только на клиенте)
  useEffect(() => {
    dispatch(hydrateAuth());
    setHydrationDone(true);
  }, [dispatch]);

  // Принудительно рендерим children на сервере, чтобы избежать Hydration Mismatch
  // AuthGuard работает как обёртка для редиректов, а не для блокировки контента

  useEffect(() => {
    if (isPublicPath && !isResetPassword) {
      setIsReady(true);
      return;
    }

    if (isInitialized) {
      setIsReady(true);
    }
  }, [isInitialized, isPublicPath, isResetPassword, hydrationDone]);

  useEffect(() => {
    // Вызываем getMe только после гидратации и если не инициализированы
    if (!isInitialized && hydrationDone && !isGetMeLoading) {
      const lsToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null;

      if (lsToken) {
        getMe()
          .unwrap()
          .catch(() => {});
      }
    }
  }, [isInitialized, hydrationDone, getMe, isGetMeLoading]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (isAuthenticated && isPublicPath && !isResetPassword) {
      router.replace('/dashboard');
    } else if (!isAuthenticated && !isPublicPath) {
      router.replace('/login');
    }
  }, [
    isReady,
    isAuthenticated,
    isPublicPath,
    isResetPassword,
    router,
    pathname,
  ]);

  if (!isReady && !isPublicPath) {
    return (
      <div
        suppressHydrationWarning
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
