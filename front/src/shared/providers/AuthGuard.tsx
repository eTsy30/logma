// front/src/shared/providers/AuthGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { routes } from 'shared/router/paths';
import { useLazyGetMeQuery } from 'redux/auth/api';
import {
  restoreToken,
  selectIsAuthenticated,
  selectIsInitialized,
} from 'redux/auth/slice';
import { AppDispatch } from 'redux/store';
import s from './AuthGuard.module.scss';

const publicRoutes = [
  routes.login,
  routes.registration,
  routes.forgotPassword,
  routes.resetPassword,
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);
  const [getMe] = useLazyGetMeQuery();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ← восстанавливаем токен из localStorage при старте
    dispatch(restoreToken());
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialized) return;

    const initAuth = async () => {
      const isPublicRoute = publicRoutes.some((route) =>
        pathname?.startsWith(route),
      );

      if (isAuthenticated && !isPublicRoute) {
        // Проверяем валидность токена
        try {
          await getMe().unwrap();
        } catch {
          // Токен невалиден — редирект на логин
          router.replace(routes.login);
        }
      } else if (isAuthenticated && isPublicRoute) {
        // Уже авторизован, но на публичной странице — редирект на дашборд
        router.replace(routes.dashboard);
      } else if (!isAuthenticated && !isPublicRoute) {
        // Не авторизован и на защищённой странице — редирект на логин
        router.replace(routes.login);
      }

      setIsLoading(false);
    };

    initAuth();
  }, [isAuthenticated, isInitialized, pathname, router, getMe]);

  if (!isInitialized || isLoading) {
    return <div className={s.loader}>Загрузка...</div>;
  }

  return <>{children}</>;
}
