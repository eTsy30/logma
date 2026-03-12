'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from 'redux/store';
import Loading from '../loading';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace(
        `/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`,
      );
    }
  }, [isInitialized, isAuthenticated, router, pathname]);

  if (!mounted) {
    return children;
  }

  if (!isInitialized) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
