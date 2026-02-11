'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import {
  useFormContext,
  Controller,
  RegisterOptions,
  FieldValues,
} from 'react-hook-form';
import { FormLabel, FormError } from '@ariakit/react';
import s from './Input.module.scss';
import { InputProps } from './type/types';

// Иконка по умолчанию для поиска
const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="20"
    height="20"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

// Функция для объединения refs
function mergeRefs<T>(
  ref1: ((instance: T | null) => void) | RefObject<T> | null | undefined,
  ref2: ((instance: T | null) => void) | RefObject<T> | null | undefined,
): (instance: T | null) => void {
  return (instance: T | null) => {
    // Вызываем field.ref
    if (typeof ref1 === 'function') {
      ref1(instance);
    } else if (ref1 && 'current' in ref1) {
      ref1.current = instance;
    }
    // Вызываем forwarded ref
    if (typeof ref2 === 'function') {
      ref2(instance);
    } else if (ref2 && 'current' in ref2) {
      ref2.current = instance;
    }
  };
}

type RefObject<T> = { current: T | null };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    name,
    type = 'text',
    size = 'md',
    label,
    placeholder,
    iconLeft,
    iconRight,
    autoFocus,
    autoComplete,
    disabled,
    required,
    rules,
  },
  ref,
) {
  const { control } = useFormContext();
  const leftIcon = type === 'search' && !iconLeft ? <SearchIcon /> : iconLeft;

  // Объединяем required с rules
  const finalRules: RegisterOptions<FieldValues, string> = {
    ...rules,
    ...(required && { required: 'Обязательное поле' }),
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={finalRules}
      render={({ field, fieldState }) => {
        const inputRef = mergeRefs(field.ref, ref);

        return (
          <div className={s.field} data-size={size}>
            {label && (
              <label
                htmlFor={name}
                className={s.label}
                data-required={required}
              >
                {label}
              </label>
            )}
            <div className={s.inputWrapper}>
              {leftIcon && (
                <span className={clsx(s.icon, s.iconLeft)} aria-hidden="true">
                  {leftIcon}
                </span>
              )}

              <input
                {...field}
                ref={inputRef}
                id={name}
                type={type}
                placeholder={placeholder}
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                disabled={disabled}
                required={required}
                value={field.value ?? ''}
                className={clsx(
                  s.input,
                  leftIcon && s.hasIconLeft,
                  iconRight && s.hasIconRight,
                )}
              />

              {iconRight && (
                <span className={clsx(s.icon, s.iconRight)} aria-hidden="true">
                  {iconRight}
                </span>
              )}
            </div>

            {fieldState.error && (
              <span className={s.error}>{fieldState.error.message}</span>
            )}
          </div>
        );
      }}
    />
  );
});
