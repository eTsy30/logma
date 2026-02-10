'use client';
import {
  useFormContext,
  FormError as AriakitFormError,
  FormLabel as AriakitFormLabel,
  FormInput as AriakitFormInput,
} from '@ariakit/react';
import { forwardRef } from 'react';
import clsx from 'clsx';
import s from './Input.module.scss';
import SearchIcon from 'public/icons/search.svg';
import { TextInputProps } from './type/types';

export const Input = forwardRef<HTMLInputElement, TextInputProps>(function Input(
  {
    size = 'md',
    type = 'text',
    name,
    id,
    label,
    placeholder,
    helperText,
    disabled,
    required,
    iconLeft,
    iconRight,
    value,
    error: errorProp,
    ...props
  },
  ref,
) {
  const store = useFormContext();
  const storeError = store?.useState((state) => state.errors[name]);
  const hasError = !!errorProp || !!storeError;
  const error = errorProp ?? storeError;
  const errorMessage = typeof error === 'object' && error !== null ? JSON.stringify(error) : error;
  const leftIcon = type === 'search' && !iconLeft ? <SearchIcon /> : iconLeft;

  return (
    <div className={s.field} data-size={size}>
      {label && (
        <AriakitFormLabel name={name} className={s.label} data-required={required}>
          {label}
        </AriakitFormLabel>
      )}

      <div className={s.inputWrapper}>
        {leftIcon && (
          <span className={clsx(s.icon, s.iconLeft)} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <AriakitFormInput
          ref={ref}
          name={name}
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          value={value}
          className={clsx(s.input, leftIcon && s.hasIconLeft, iconRight && s.hasIconRight)}
          {...props}
        />

        {iconRight && (
          <span className={clsx(s.icon, s.iconRight)} aria-hidden="true">
            {iconRight}
          </span>
        )}
      </div>

      {helperText && !hasError && <span className={s.helper}>{helperText}</span>}

      {hasError && (
        <AriakitFormError name={name} className={s.error}>
          {errorMessage}
        </AriakitFormError>
      )}
    </div>
  );
});
