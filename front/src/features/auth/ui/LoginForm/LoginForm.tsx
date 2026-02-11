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

export const LoginForm = () => {
  const methods = useForm<LoginFormData>({
    mode: 'onTouched',
    resolver: zodResolver(LoginSchema),
  });
  const onSubmit = async (data: LoginFormData) => {
    console.log(data, 'data');
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

            <Button type="submit" className={s.button} fullWidth>
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
