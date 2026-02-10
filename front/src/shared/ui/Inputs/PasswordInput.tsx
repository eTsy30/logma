import { useState, forwardRef } from 'react';
import { t } from 'shared/lib/i18n';
import { PasswordInputProps } from './type/types';
import {
  useFormContext,
  FormError as AriakitFormError,
  FormLabel as AriakitFormLabel,
  FormInput as AriakitFormInput,
} from '@ariakit/react';
import EyeIcon from 'public/icons/on.svg';
import EyeOffIcon from 'public/icons/off.svg';
import clsx from 'clsx';
import { calculateStrength } from './helpers/helpers';
import s from './Input.module.scss';
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      size = 'md',
      name,
      id,
      label,
      placeholder,
      helperText,
      disabled,
      required,
      showStrength,
      value: valueProp,
      error: errorProp,
      ...props
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const store = useFormContext();
    const storeError = store?.useState((state) => state.errors[name]);
    const storeValue = store?.useState((state) => state.values[name] as string) || '';
    const hasError = !!errorProp || !!storeError;
    const error = errorProp ?? storeError;
    const value = valueProp ?? storeValue;
    const errorMessage =
      typeof error === 'object' && error !== null ? JSON.stringify(error) : error;
    const strength = showStrength ? calculateStrength(value) : null;

    return (
      <div className={s.field} data-size={size}>
        {label && (
          <AriakitFormLabel name={name} className={s.label} data-required={required}>
            {label}
          </AriakitFormLabel>
        )}

        <div className={s.inputWrapper}>
          <AriakitFormInput
            ref={ref}
            name={name}
            id={id}
            type={visible ? 'text' : 'password'}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            value={value}
            className={clsx(s.input, s.passwordInput)}
            {...props}
          />

          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className={s.togglePassword}
            tabIndex={0}
            aria-label={visible ? t('password.hide') : t('password.show')}
            aria-pressed={visible}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        {showStrength && value && (
          <div className={s.strengthMeter} data-strength={strength?.level}>
            <div className={s.strengthBar} />
            <span className={s.strengthText}>{strength?.label}</span>
          </div>
        )}

        {helperText && !hasError && <span className={s.helper}>{helperText}</span>}

        {hasError && (
          <AriakitFormError name={name} className={s.error}>
            {errorMessage}
          </AriakitFormError>
        )}
      </div>
    );
  },
);
