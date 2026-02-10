export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'password' | 'search' | 'email' | 'tel' | 'url' | 'number';
export type ResizeType = 'none' | 'vertical' | 'horizontal' | 'both';

// ============================================
// Base Input Props
// ============================================
export interface BaseInputProps {
  size?: InputSize;
  name: string;
  id?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  readOnly?: boolean;
  value?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// ============================================
// Text Input
// ============================================
export interface TextInputProps extends BaseInputProps {
  type?: Exclude<InputType, 'password'>;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

// ============================================
// Password Input
// ============================================
export interface PasswordInputProps extends Omit<BaseInputProps, 'type'> {
  showStrength?: boolean;
}
// ============================================
// Textarea
// ============================================
export interface TextareaProps extends BaseInputProps {
  rows?: number;
  resize?: ResizeType;
}
