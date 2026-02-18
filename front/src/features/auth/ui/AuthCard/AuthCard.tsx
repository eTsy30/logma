import { ReactNode } from 'react';
import s from './AuthCard.module.scss';
import cx from 'clsx';
export const AuthCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={cx(s.wrapper, className)}>{children}</div>;
};
