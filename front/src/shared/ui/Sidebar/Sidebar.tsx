// widgets/Header/ui/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import cx from 'clsx';
import { ArrowLeft, Moon, Sun, Search } from 'lucide-react';
import OffIcon from 'public/icons/off.svg';
import Logout from 'public/icons/logout.svg';
import { useTheme } from 'next-themes';
import { logout } from 'redux/auth/slice';
import { useAppDispatch } from 'redux/store';
import s from './Sidebar.module.scss';
import { MovieSearch } from 'features/movie-search';

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDashboard = pathname === '/dashboard';
  const showSearch = isDashboard;

  return (
    <header className={s.header}>
      <div className={cx(s.container, isSearchOpen && s.searchActive)}>
        {/* Лево */}
        <div className={s.left}>
          {isSearchOpen ? (
            <button
              className={s.backBtn}
              onClick={() => setIsSearchOpen(false)}
              aria-label="Назад"
            >
              <ArrowLeft size={24} />
            </button>
          ) : (
            <Link href="/dashboard" className={s.logo}>
              <span className={s.dot} />
              <span className={s.text}>Logma</span>
            </Link>
          )}
        </div>

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
                  <MovieSearch />
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
