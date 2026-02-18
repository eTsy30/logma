'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import {
  useFormContext,
  Controller,
  RegisterOptions,
  FieldValues,
} from 'react-hook-form';
import { Search, AlertCircle } from 'lucide-react';
import s from './Input.module.scss';
import { InputProps } from './type/types';

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
  const formContext = useFormContext();
  const leftIcon =
    type === 'search' && !iconLeft ? <Search size={20} /> : iconLeft;

  const finalRules: RegisterOptions<FieldValues, string> = {
    ...rules,
    ...(required && { required: 'Обязательное поле' }),
  };

  if (!formContext) {
    return (
      <div className={s.field} data-size={size}>
        {label && (
          <label htmlFor={name} className={s.label} data-required={required}>
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
            ref={ref}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            disabled={disabled}
            required={required}
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
      </div>
    );
  }

  return (
    <Controller
      name={name}
      control={formContext.control}
      rules={finalRules}
      render={({ field, fieldState }) => (
        <div className={s.field} data-size={size}>
          {label && (
            <label htmlFor={name} className={s.label} data-required={required}>
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
              ref={(instance) => {
                field.ref(instance);
                if (typeof ref === 'function') ref(instance);
                else if (ref) ref.current = instance;
              }}
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
            <span className={s.error}>
              <AlertCircle size={14} />
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
});
