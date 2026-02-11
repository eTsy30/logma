'use client';
import { useTheme } from 'next-themes';
import OffIcon from 'public/icons/off.svg';
import s from './Footer.module.scss';
export const Footer = () => {
  const { theme, setTheme } = useTheme();
  return (
    <footer className={s.footer}>
      <p className={s.footer__title}>© {new Date().getFullYear()}</p>
      <OffIcon
        width={30}
        height={30}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
    </footer>
  );
};
