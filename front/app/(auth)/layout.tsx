'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from 'redux/store';
import Loading from '../loading';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!mounted) {
    return children;
  }

  if (!isInitialized) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return null;
  }

  return children;
}
