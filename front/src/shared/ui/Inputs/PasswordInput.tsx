'use client';

import { useState, forwardRef } from 'react';
import {
  useFormContext,
  Controller,
  RegisterOptions,
  FieldValues,
} from 'react-hook-form';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import s from './Input.module.scss';
import { calculateStrength } from './helpers/helpers';
import { PasswordInputProps } from './type/types';

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

    const finalRules: RegisterOptions<FieldValues, string> = {
      ...(required && { required: 'Обязательное поле' }),
      ...rules,
    };

    return (
      <Controller
        name={name}
        control={control}
        rules={finalRules}
        render={({ field, fieldState }) => (
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
                ref={(instance) => {
                  field.ref(instance);
                  if (typeof ref === 'function') ref(instance);
                  else if (ref) ref.current = instance;
                }}
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
                {visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {showStrength && value && (
              <div className={s.strengthMeter} data-strength={strength?.level}>
                <div className={s.strengthBar} />
                <span className={s.strengthText}>{strength?.label}</span>
              </div>
            )}
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
  },
);
