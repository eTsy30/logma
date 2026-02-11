'use client';

import s from './home.module.scss';
import { Button } from 'shared/ui/Button';

export function HomeView() {
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
          <Button theme="primary">Регистрация </Button>
          <Button theme="secondary">Вход</Button>
        </div>
      </div>
    </article>
  );
}
