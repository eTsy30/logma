'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCard, RegistrationData, RegistrationSchema } from 'features/auth';
import { Input, PasswordInput } from 'shared/ui/Inputs';
import { Button } from 'shared/ui/Button';
import s from './RegistrationForm.module.scss';
import { Link } from 'shared/ui/Link';
import { routes } from 'shared/router/paths';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function registerUser(data: RegisterRequest) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = `Register failed with status ${response.status}`;

    if (contentType && contentType.includes('application/json')) {
      try {
        const error = await response.json();
        errorMessage = error?.message || errorMessage;
      } catch {
        // Ignore JSON parse errors
      }
    }

    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;
}

export function RegistrationForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const methods = useForm<RegistrationData>({
    mode: 'onTouched',
    resolver: zodResolver(RegistrationSchema),
  });

  const onSubmit = async (data: RegistrationData) => {
    setServerError(null);

    try {
      await registerUser(data);
      // TODO: redirect or set auth state
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при регистрации';
      setServerError(message);
      methods.setError('root', { message });
    }
  };

  return (
    <div className={s.wrapper}>
      <AuthCard>
        <h2 className={s.title}>Создать аккаунт</h2>
        <h4 className={s.sub_title}>Начните вести свой кинодневник</h4>
        <FormProvider {...methods}>
          <form className={s.form} onSubmit={methods.handleSubmit(onSubmit)}>
            <Input name="name" label="Имя" size="md" />

            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="user@example.com"
              size="md"
            />

            <PasswordInput
              name="password"
              label="Пароль"
              size="md"
              showStrength
            />

            {methods.formState.errors.root && (
              <span className={s.error}>
                {methods.formState.errors.root.message}
              </span>
            )}

            {serverError && <span className={s.error}>{serverError}</span>}

            <Button
              type="submit"
              className={s.button}
              fullWidth
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting
                ? 'Регистрация...'
                : 'Зарегистрироваться'}
            </Button>
            <Link className={s.footer_text} href={routes.login}>
              Уже есть аккаунт? <span className={s.link}>Войти</span>
            </Link>
          </form>
        </FormProvider>
      </AuthCard>
    </div>
  );
}
