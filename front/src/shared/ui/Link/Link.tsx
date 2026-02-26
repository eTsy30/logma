import { type ReactNode } from 'react';
import NextLink, { type LinkProps } from 'next/link';
import cx from 'clsx';

import styles from './Link.module.scss';

export function Link({
  children = null,
  className = '',
  theme = 'default',
  underline = false,
  newWindow = false,
  ...props
}: {
  children?: ReactNode;
  className?: string;
  theme?: 'green' | 'default';
  underline?: boolean;
  newWindow?: boolean;
} & LinkProps) {
  const classNames = cx(
    styles.link,
    theme && styles[theme],
    underline && styles.underline,
    className,
  );

  return (
    <NextLink
      {...props}
      className={classNames}
      rel={newWindow ? 'noopener noreferrer' : undefined}
      target={newWindow ? '_blank' : undefined}
    >
      {children}
    </NextLink>
  );
}
