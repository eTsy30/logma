'use client';

import { useEffect } from 'react';

import styles from './error.module.scss';

import { ServiceUnavailableView } from '../ServiceUnavailable/service-unavailable.view';
import { routes } from 'shared/router/paths';

const STATUS_CONTENT = {
  404: {
    // icon: Error404Icon,
    text: 'Страница не найдена',
    buttonsText: 'Перейти на главную',
    route: routes.homepage,
  },
  501: {
    // icon: Error501Icon,
    text: 'Ошибка обработки',
    buttonsText: 'Перейти на главную',
    route: routes.homepage,
  },
} as const;

export type ErrorPageProps = { statusCode?: 404 | 501 | 502; error?: Error };

export function ErrorView({ statusCode = 404, error }: ErrorPageProps) {
  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  if (statusCode === 502) {
    return <ServiceUnavailableView />;
  }

  const { text, buttonsText, route } = STATUS_CONTENT[statusCode];

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <p className={styles.message}>{text}</p>
        <button>
          <span className={styles['button-content']}>{buttonsText}</span>
        </button>
      </div>
    </main>
  );
}
