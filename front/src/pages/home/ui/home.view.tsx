'use client';

import s from './home.module.scss';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from 'shared/ui/Button';

import { Header } from 'shared/ui/Header';
import { Footer } from 'shared/ui/Footer';

export function HomeView() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <article className={s.container}>
        <Header />
        <div className={s.content}>
          <div className={s.title_wrapper}>
            <h1 className={s.title}>
              <p className={s.title_orange}>Личный кинодневник </p>забудь о хаосе в заметках
            </h1>
            <h5 className={s.sub_title}>Твои фильмы. Твои оценки. Твои правила</h5>
          </div>
          <div className={s.button_group}>
            <Button theme="primary">Регистрация </Button>
            <Button theme="secondary">Вход</Button>
          </div>
        </div>
        <Footer />
      </article>
    );
  }

  return (
    <article className={s.container}>
      <Header />
      <div className={s.content}>
        <div className={s.title_wrapper}>
          <h1 className={s.title}>
            <p className={s.title_orange}>Личный кинодневник </p>забудь о хаосе в заметках
          </h1>
          <h5 className={s.sub_title}>Твои фильмы. Твои оценки. Твои правила</h5>
        </div>
        <div className={s.button_group}>
          <Button theme="primary">Регистрация </Button>
          <Button theme="secondary">Вход</Button>
        </div>
      </div>

      <Footer />
      <div className={s.themeToggle}>
        <Button
          theme="light"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </Button>
      </div>
    </article>
  );
}
