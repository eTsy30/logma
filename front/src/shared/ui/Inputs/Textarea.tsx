import clsx from 'clsx';
import { forwardRef } from 'react';
import s from './Input.module.scss';
import { TextareaProps } from './type/types';
import {
  useFormContext,
  FormError as AriakitFormError,
  FormLabel as AriakitFormLabel,
  FormInput as AriakitFormInput,
} from '@ariakit/react';
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    size = 'md',
    name,
    id,
    label,
    placeholder,
    helperText,
    disabled,
    required,
    rows = 4,
    resize = 'vertical',
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

  return (
    <div className={s.field} data-size={size}>
      {label && (
        <AriakitFormLabel name={name} className={s.label} data-required={required}>
          {label}
        </AriakitFormLabel>
      )}

      <AriakitFormInput
        ref={ref as React.Ref<HTMLInputElement>}
        name={name}
        id={id}
        render={<textarea rows={rows} />}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        value={value}
        className={clsx(s.input, s.textarea)}
        data-resize={resize}
        {...props}
      />

      {helperText && !hasError && <span className={s.helper}>{helperText}</span>}

      {hasError && (
        <AriakitFormError name={name} className={s.error}>
          {errorMessage}
        </AriakitFormError>
      )}
    </div>
  );
});
