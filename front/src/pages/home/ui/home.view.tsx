'use client';

import { routes } from 'shared/router/paths';
import s from './home.module.scss';
import { Button } from 'shared/ui/Button';
import { useRouter } from 'next/navigation';

export function HomeView() {
  const router = useRouter();
  return (
    <article className={s.container}>
      <div className={s.content}>
        <div className={s.title_wrapper}>
          <h1 className={s.title}>
            <p className={s.title_orange}>Личный кинодневник </p>забудь о хаосе
            в заметках
          </h1>
          <h5 className={s.sub_title}>
            Твои фильмы. Твои оценки. Твои правила
          </h5>
        </div>
        <div className={s.button_group}>
          <Button
            theme="primary"
            onClick={() => router.push(routes.registration)}
          >
            Регистрация{' '}
          </Button>
          <Button theme="secondary" onClick={() => router.push(routes.login)}>
            Вход
          </Button>
        </div>
      </div>
    </article>
  );
}
