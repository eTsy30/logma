'use client';

import { useEffect } from 'react';
import { useLazyGetMeQuery } from 'redux/auth/api';
import { useAppSelector } from 'redux/store';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const { isInitialized } = useAppSelector((s) => s.auth);
  const [getMe] = useLazyGetMeQuery();

  useEffect(() => {
    if (!isInitialized) {
      getMe();
    }
  }, [isInitialized, getMe]);

  return children;
}
