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
          <h1 className={s.title}>Личный кинодневник</h1>
          <h5 className={s.sub_title}>забудь о хаосе в заметках</h5>
          <p className={s.text}> Твои фильмы. Твои оценки. Твои правила. </p>
        </div>

        <Button
          theme="secondary"
          size="lg"
          onClick={() => router.push(routes.login)}
        >
          Начать вести дневник
        </Button>
      </div>
    </article>
  );
}
