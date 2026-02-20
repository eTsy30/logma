'use client';

import { forwardRef } from 'react';
import {
  useFormContext,
  Controller,
  RegisterOptions,
  FieldValues,
} from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import s from './Input.module.scss';
import { TextareaProps } from './type/types';

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
            <textarea
              {...field}
              ref={(instance) => {
                field.ref(instance);
                if (typeof ref === 'function') ref(instance);
                else if (ref) ref.current = instance;
              }}
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
