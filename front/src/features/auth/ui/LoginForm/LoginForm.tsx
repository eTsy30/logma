'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, PasswordInput } from 'shared/ui/Inputs';
import { AuthCard } from '../AuthCard/AuthCard';
import { LoginFormData, LoginSchema } from 'features/auth/model/login.types';
import s from './LoginForm.module.scss';
import { Button } from 'shared/ui/Button';
import Link from 'next/link';
import { routes } from 'shared/router/paths';
import { useLazyGetMeQuery, useLoginMutation } from 'redux/auth/api';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const [login] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();
  const router = useRouter();

  const methods = useForm<LoginFormData>({
    mode: 'onTouched',
    resolver: zodResolver(LoginSchema),
  });

  const {
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password }).unwrap();
      await getMe().unwrap();
      router.push(routes.dashboard);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Неверный email или пароль';
      methods.setError('root', { message });
    }
  };

  return (
    <div className={s.wrapper}>
      <AuthCard>
        <div className={s.header}>
          <h2 className={s.title}>Добро пожаловать!</h2>
          <p className={s.subTitle}>Продолжите вести свой кинодневник</p>
        </div>

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

            <Button
              type="submit"
              className={s.button}
              fullWidth
              size="lg"
              disabled={isSubmitting}
              loading={isSubmitting}
              theme="ghost"
            >
              {isSubmitting ? 'Входим...' : 'Войти'}
            </Button>

            <div className={s.footer}>
              <span className={s.footerText}>Ещё нет аккаунта?</span>
              <Link className={s.link} href={routes.registration}>
                Регистрация
              </Link>
            </div>
          </form>
        </FormProvider>
        <div className={s.linksRow}>
          <Link href={routes.forgotPassword} className={s.forgotLink}>
            Забыли пароль?
          </Link>
        </div>
      </AuthCard>
    </div>
  );
};
