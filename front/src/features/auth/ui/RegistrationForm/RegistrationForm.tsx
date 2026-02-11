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
import {
  useLazyGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
} from 'redux/auth/api';
import { useRouter } from 'next/navigation';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
export function RegistrationForm() {
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const methods = useForm<RegistrationData>({
    mode: 'onTouched',
    resolver: zodResolver(RegistrationSchema),
  });

  const onSubmit = async (data: RegistrationData) => {
    setServerError(null);

    try {
      await register({
        email: data.email,
        password: data.password,
        name: data.name,
      }).unwrap();
      await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      await getMe().unwrap();
      router.push(routes.dashboard);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при регистрации';
      setServerError(message);
      methods.setError('root', { message });
    }
  };
  const {
    formState: { isValid, isSubmitting },
  } = methods;

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
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
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
