'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLazyGetMeQuery } from 'redux/auth/api';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { hydrateAuth, setInitialized } from 'redux/auth/slice';
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
  const { isAuthenticated, isInitialized, accessToken } = useAppSelector(
    (s) => s.auth,
  );
  const [getMe, { isLoading: isGetMeLoading }] = useLazyGetMeQuery();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [hydrationDone, setHydrationDone] = useState(false);

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname?.startsWith(path));
  const isResetPassword = pathname?.startsWith('/reset-password');

  console.log('[AUTH_GUARD] Render:', {
    pathname,
    isAuthenticated,
    isInitialized,
    hasToken: !!accessToken,
    isReady,
    hydrationDone,
    isGetMeLoading,
    localStorageToken:
      typeof window !== 'undefined'
        ? !!localStorage.getItem('accessToken')
        : 'N/A',
  });

  // 🔥 Гидратация при монтировании (только на клиенте)
  useEffect(() => {
    console.log('[AUTH_GUARD] Mount effect: calling hydrateAuth');
    dispatch(hydrateAuth());
    setHydrationDone(true);
  }, [dispatch]);

  useEffect(() => {
    console.log('[AUTH_GUARD] Ready check effect:', {
      isPublicPath,
      isInitialized,
      isResetPassword,
      hydrationDone,
    });

    if (isPublicPath && !isResetPassword) {
      console.log('[AUTH_GUARD] Public path, setting ready immediately');
      setIsReady(true);
      return;
    }

    if (isInitialized) {
      console.log('[AUTH_GUARD] isInitialized=true, setting ready');
      setIsReady(true);
    }
  }, [isInitialized, isPublicPath, isResetPassword, hydrationDone]);

  useEffect(() => {
    console.log('[AUTH_GUARD] getMe effect:', {
      isInitialized,
      hydrationDone,
      isGetMeLoading,
    });

    // 🔥 Вызываем getMe только после гидратации и если не инициализированы
    if (!isInitialized && hydrationDone && !isGetMeLoading) {
      const lsToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null;
      console.log(
        '[AUTH_GUARD] Calling getMe, localStorage token exists:',
        !!lsToken,
      );

      getMe()
        .unwrap()
        .then((data) => {
          console.log('[AUTH_GUARD] getMe success:', data);
        })
        .catch((error) => {
          console.log('[AUTH_GUARD] getMe error:', error);
        });
    }
  }, [isInitialized, hydrationDone, getMe, isGetMeLoading]);

  useEffect(() => {
    console.log('[AUTH_GUARD] Redirect effect:', {
      isReady,
      isAuthenticated,
      isPublicPath,
      pathname,
    });

    if (!isReady) {
      console.log('[AUTH_GUARD] Not ready, skipping redirect');
      return;
    }

    if (isAuthenticated && isPublicPath && !isResetPassword) {
      console.log(
        '[AUTH_GUARD] Authenticated on public path -> redirect to /dashboard',
      );
      router.replace('/dashboard');
    } else if (!isAuthenticated && !isPublicPath) {
      console.log(
        '[AUTH_GUARD] Not authenticated on private path -> redirect to /login',
      );
      router.replace('/login');
    } else {
      console.log('[AUTH_GUARD] No redirect needed');
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
    console.log('[AUTH_GUARD] Showing loading screen');
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

  console.log('[AUTH_GUARD] Rendering children');
  return children;
}
