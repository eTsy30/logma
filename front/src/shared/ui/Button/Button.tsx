import { Button as AriakitButton } from '@ariakit/react';
import clsx from 'clsx';
import s from './Button.module.scss';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonTheme = 'primary' | 'secondary' | 'light' | 'link' | 'ghost';

interface ButtonProps extends React.ComponentProps<typeof AriakitButton> {
  size?: ButtonSize;
  theme?: ButtonTheme;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button({
  size = 'md',
  theme = 'primary',
  loading,
  fullWidth,
  iconLeft,
  iconRight,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const content = loading ? (
    <span className={s.spinner} />
  ) : (
    <>
      {iconLeft && <span className={s.icon}>{iconLeft}</span>}
      {children}
      {iconRight && <span className={s.icon}>{iconRight}</span>}
    </>
  );

  return (
    <AriakitButton
      {...props}
      disabled={disabled || loading}
      data-size={size}
      data-theme={theme}
      data-loading={loading}
      data-fullwidth={fullWidth}
      className={clsx(s.button, className)}
    >
      {content}
    </AriakitButton>
  );
}
