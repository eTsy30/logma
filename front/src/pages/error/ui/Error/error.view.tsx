'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './error.module.scss';
import { ServiceUnavailableView } from '../ServiceUnavailable/service-unavailable.view';
import { routes } from 'shared/router/paths';
import { Logo } from 'shared/ui/Logo/Logo';

const STATUS_CONTENT = {
  404: {
    text: 'Страница не найдена',
    subtext: 'К сожалению, запрашиваемая страница не существует',
    buttonText: 'Перейти на главную',
    route: routes.homepage,
    color: 'var(--warning, #f59e0b)', // Используем warning цвет из темы или fallback
  },
  501: {
    text: 'Ошибка обработки',
    subtext: 'Произошла внутренняя ошибка сервера',
    buttonText: 'Перейти на главную',
    route: routes.homepage,
    color: 'var(--error, #ef4444)', // Используем error цвет из темы или fallback
  },
} as const;

export type ErrorPageProps = { statusCode?: 404 | 501 | 502; error?: Error };

export function ErrorView({ statusCode = 404, error }: ErrorPageProps) {
  const router = useRouter();
  const controls = useAnimation();

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  useEffect(() => {
    const animateLoop = async () => {
      while (true) {
        await controls.start('visible');
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await controls.start('hidden');
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    };
    animateLoop();
  }, [controls]);

  if (statusCode === 502) {
    return <ServiceUnavailableView />;
  }

  const { text, subtext, buttonText, route, color } =
    STATUS_CONTENT[statusCode];

  const handleNavigate = () => {
    router.push(route);
  };

  // Устанавливаем CSS переменную для цвета статуса
  const style = {
    '--status-color': color,
  } as React.CSSProperties;

  return (
    <main className={styles.container} style={style}>
      <div className={styles.wrapper}>
        <div className={styles.iconWrapper}>
          <Logo size={180} />
        </div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {statusCode}
        </motion.h1>

        <motion.p
          className={styles.message}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {text}
        </motion.p>

        <motion.p
          className={styles.subtext}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {subtext}
        </motion.p>

        <motion.button
          className={styles.button}
          onClick={handleNavigate}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={styles.buttonContent}>{buttonText}</span>
        </motion.button>
      </div>
    </main>
  );
}
