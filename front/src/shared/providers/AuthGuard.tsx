'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLazyGetMeQuery } from 'redux/auth/api';
import { useAppSelector } from 'redux/store';
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
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname?.startsWith(path));
  const isResetPassword = pathname?.startsWith('/reset-password');

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
    if (!isInitialized) {
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
