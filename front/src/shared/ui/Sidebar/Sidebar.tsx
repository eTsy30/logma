'use client';

import { useState, useEffect } from 'react'; // ← добавь useEffect
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import cx from 'clsx';
import { Search } from 'lucide-react';
import OffIcon from 'public/icons/off.svg';
import Logout from 'public/icons/logout.svg';
import { useTheme } from 'next-themes';
import { useAppDispatch } from 'redux/store';
import { logout } from 'redux/auth/slice';

import s from './Sidebar.module.scss';
import { MovieSearch } from 'features/movie-search';
import { MiniLogo } from '../MiniLogo/MiniLogo';

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDashboard = pathname === '/dashboard';
  const showSearch = isDashboard;

  if (!mounted) {
    return (
      <header className={s.header}>
        <div className={s.container}>
          <div className={s.left}>
            <Link href="/dashboard" className={s.logo}>
              <MiniLogo mode="startup" size={40} />
            </Link>
          </div>
          {showSearch && (
            <div className={s.center}>
              <div className={s.searchDesktop}>
                <MovieSearch />
              </div>
            </div>
          )}
          <div className={s.right}>
            {/* Плейсхолдеры для кнопок */}
            <div className={s.themeToggle} style={{ width: 22, height: 22 }} />
            <div className={s.logoutBtn} style={{ width: 22, height: 22 }} />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={s.header}>
      <div className={cx(s.container, isSearchOpen && s.searchActive)}>
        {/* Лево */}
        {!isSearchOpen && (
          <div className={s.left}>
            <Link href="/dashboard" className={s.logo}>
              <MiniLogo mode="startup" size={40} />
            </Link>
          </div>
        )}

        {/* Центр: Поиск */}
        <div className={s.center}>
          {showSearch && (
            <>
              <div className={s.searchDesktop}>
                <MovieSearch />
              </div>

              {!isSearchOpen && (
                <button
                  className={s.searchMobileBtn}
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Поиск"
                >
                  <Search size={22} />
                </button>
              )}

              {isSearchOpen && (
                <div className={s.searchMobile}>
                  <MovieSearch onBack={() => setIsSearchOpen(false)} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Право */}
        {!isSearchOpen && (
          <div className={s.right}>
            <button
              className={cx(resolvedTheme === 'dark' && s.light, s.themeToggle)}
              onClick={() =>
                setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
              }
              aria-label="Сменить тему"
            >
              <OffIcon width={22} height={22} />
            </button>
            <button
              className={s.logoutBtn}
              onClick={() => dispatch(logout())}
              aria-label="Выход"
            >
              <Logout width={22} height={22} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
