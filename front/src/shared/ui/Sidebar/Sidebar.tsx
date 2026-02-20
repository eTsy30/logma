// widgets/Header/ui/Header.tsx
'use client';

import { useState, useEffect } from 'react';
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
import { Logo } from '../Logo/Logo';

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isDashboard = pathname === '/dashboard';
  const showSearch = isDashboard;

  return (
    <header className={s.header}>
      <div className={cx(s.container, isSearchOpen && s.searchActive)}>
        {/* Лево */}
        {!isSearchOpen && (
          <div className={s.left}>
            <Link href="/dashboard" className={s.logo}>
              <Logo redrawInterval={300} photoMode={true} size={40} />
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
              className={cx(theme === 'dark' && s.light, s.themeToggle)}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
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
