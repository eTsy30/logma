import { ReactNode } from 'react';
import s from './AuthCard.module.scss';
export const AuthCard = ({ children }: { children: ReactNode }) => {
  return <div className={s.wrapper}>{children}</div>;
};
