import { ReactNode } from 'react';
import { RegisterOptions, FieldValues } from 'react-hook-form';

export interface BaseInputProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rules?: RegisterOptions<FieldValues, string>;
}

export interface InputProps extends BaseInputProps {
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
  variant?: 'default' | 'ghost';
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  autoFocus?: boolean;
  autoComplete?: string;
}

export interface PasswordInputProps extends BaseInputProps {
  showStrength?: boolean;
}

export interface TextareaProps extends BaseInputProps {
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}
