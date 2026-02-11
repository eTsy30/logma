'use client';
import s from './Header.module.scss';
import IdeaIcon from '../../../../public/icons/Idea.svg';
import { Button } from '../Button';
import { logout } from 'redux/auth/slice';
import { useAppDispatch } from 'redux/store';

export const Header = () => {
  const dispatch = useAppDispatch();
  return (
    <header className={s.header}>
      <h1 className={s.logo}>
        L
        <span className={s.idea}>
          <IdeaIcon />
        </span>
        gma
      </h1>
      <Button onClick={() => dispatch(logout())}>Выход</Button>
    </header>
  );
};
