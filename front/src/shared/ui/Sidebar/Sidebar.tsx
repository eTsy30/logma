'use client';
import s from './Sidebar.module.scss';
import IdeaIcon from '../../../../public/icons/Idea.svg';
import OffIcon from 'public/icons/off.svg';
import Logout from 'public/icons/logout.svg'; // или любая другая иконка выхода
import { logout } from 'redux/auth/slice';
import { useAppDispatch } from 'redux/store';
import { useTheme } from 'next-themes';

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();

  return (
    <aside className={s.sidebar}>
      <div className={s.top}>
        <h1 className={s.logo}>
          <span className={s.letter}>L</span>
          <span className={s.idea}>
            <IdeaIcon />
          </span>
          <span className={s.letters}>
            <span>g</span>
            <span>m</span>
            <span>a</span>
          </span>
        </h1>
      </div>

      <div className={s.bottom}>
        <button
          className={s.themeToggle}
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
        <p className={s.year}>© {new Date().getFullYear()}</p>
      </div>
    </aside>
  );
};
