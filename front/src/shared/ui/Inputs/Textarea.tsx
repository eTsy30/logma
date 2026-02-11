'use client';

import { forwardRef } from 'react';
import {
  useFormContext,
  Controller,
  RegisterOptions,
  FieldValues,
} from 'react-hook-form';
import { FormLabel, FormError } from '@ariakit/react';
import clsx from 'clsx';
import s from './Input.module.scss';
import { TextareaProps } from './type/types';

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

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      name,
      size = 'md',
      label,
      placeholder,
      rows = 4,
      resize = 'vertical',
      disabled,
      required,
      rules,
    },
    ref,
  ) {
    const { control } = useFormContext();

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
          const textareaRef = mergeRefs(field.ref, ref);

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

              <textarea
                {...field}
                ref={textareaRef}
                id={name}
                rows={rows}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                value={field.value ?? ''}
                className={clsx(s.input, s.textarea)}
                data-resize={resize}
              />

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
