'use client';

import { useState, forwardRef } from 'react';
import {
  useFormContext,
  Controller,
  RegisterOptions,
  FieldValues,
} from 'react-hook-form';
import clsx from 'clsx';
import s from './Input.module.scss';
import EyeIcon from 'public/icons/eye.svg';
import EyeCloseIcon from 'public/icons/eyeClosed.svg';
import { calculateStrength } from './helpers/helpers';
import { PasswordInputProps } from './type/types';

// Функция для объединения refs
function mergeRefs<T>(
  ref1: ((instance: T | null) => void) | RefObject<T> | null | undefined,
  ref2: ((instance: T | null) => void) | RefObject<T> | null | undefined,
): (instance: T | null) => void {
  return (instance: T | null) => {
    if (typeof ref1 === 'function') {
      ref1(instance);
    } else if (ref1 && 'current' in ref1) {
      ref1.current = instance;
    }
    if (typeof ref2 === 'function') {
      ref2(instance);
    } else if (ref2 && 'current' in ref2) {
      ref2.current = instance;
    }
  };
}

type RefObject<T> = { current: T | null };

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      name,
      size = 'md',
      label,
      placeholder,
      showStrength,
      disabled,
      required,
      rules,
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const { control, watch } = useFormContext();
    const value = watch(name) || '';
    const strength = showStrength ? calculateStrength(value) : null;

    // Сначала добавляем required, потом перезаписываем пользовательскими rules
    const finalRules: RegisterOptions<FieldValues, string> = {
      ...(required && { required: 'Обязательное поле' }),
      ...rules,
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
                <input
                  {...field}
                  ref={inputRef}
                  id={name}
                  type={visible ? 'text' : 'password'}
                  placeholder={placeholder}
                  disabled={disabled}
                  value={field.value ?? ''}
                  className={clsx(s.input, s.passwordInput)}
                />

                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className={s.togglePassword}
                  tabIndex={-1}
                  aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {visible ? <EyeIcon /> : <EyeCloseIcon />}
                </button>
              </div>

              {showStrength && value && (
                <div
                  className={s.strengthMeter}
                  data-strength={strength?.level}
                >
                  <div className={s.strengthBar} />
                  <span className={s.strengthText}>{strength?.label}</span>
                </div>
              )}

              {fieldState.error && (
                <span className={s.error}>{fieldState.error.message}</span>
              )}
            </div>
          );
        }}
      />
    );
  },
);
