'use client';
import { Input, PasswordInput } from 'shared/ui/Inputs';
import { AuthCard } from '../AuthCard/AuthCard';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, LoginSchema } from 'features/auth/model/login.types';
import s from './LoginForm.module.scss';
import { Button } from 'shared/ui/Button';
import { FormProvider, useForm } from 'react-hook-form';
import Link from 'next/link';
import { routes } from 'shared/router/paths';
import { useLazyGetMeQuery, useLoginMutation } from 'redux/auth/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const LoginForm = () => {
  const [login] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const methods = useForm<LoginFormData>({
    mode: 'onTouched',
    resolver: zodResolver(LoginSchema),
  });
  const {
    formState: { isDirty, isSubmitting },
  } = methods;

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password }).unwrap();
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
  return (
    <div className={s.wrapper}>
      <AuthCard>
        <h2 className={s.title}>Добро пожаловать!</h2>
        <h4 className={s.sub_title}>Продолжите вести свой кинодневник</h4>
        <FormProvider {...methods}>
          <form className={s.form} onSubmit={methods.handleSubmit(onSubmit)}>
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="user@example.com"
              size="md"
            />

            <PasswordInput name="password" label="Пароль" size="md" />
            {serverError && <span className={s.error}>{serverError}</span>}
            <Button
              type="submit"
              className={s.button}
              fullWidth
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Войти
            </Button>
            <Link className={s.footer_text} href={routes.registration}>
              Еще нет аккаунта? <span className={s.link}>Регистрация</span>
            </Link>
          </form>
        </FormProvider>
      </AuthCard>
    </div>
  );
};
