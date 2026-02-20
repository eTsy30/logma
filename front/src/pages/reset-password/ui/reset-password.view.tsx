'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordInput } from 'shared/ui/Inputs';
import { Button } from 'shared/ui/Button';
import Link from 'next/link';
import { routes } from 'shared/router/paths';
import { useResetPasswordMutation } from 'redux/auth/api';
import s from './reset-password.module.scss';
import { AuthCard } from 'features/auth';
import { ResetFormData, ResetSchema } from '../model/reset.types';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token');

  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const methods = useForm<ResetFormData>({
    mode: 'onTouched',
    resolver: zodResolver(ResetSchema),
  });

  useEffect(() => {
    if (!token) {
      setIsExpired(true);
      return;
    }

    try {
      const decoded: { exp: number } = jwtDecode(token);
      if (Date.now() >= decoded.exp * 1000) {
        setIsExpired(true);
      }
    } catch {
      setIsExpired(true);
    }
  }, [token]);

  const onSubmit = async (data: ResetFormData) => {
    if (!token) return;

    try {
      await resetPassword({ token, newPassword: data.password }).unwrap();
      setIsSuccess(true);
      setTimeout(() => router.push(routes.login), 3000);
    } catch (error: any) {
      if (error?.status === 400) {
        setIsExpired(true);
      }
    }
  };

  if (isExpired) {
    return (
      <AuthCard>
        <div className={s.state}>
          <XCircle size={48} className={s.errorIcon} />
          <h2 className={s.title}>Ссылка недействительна</h2>
          <p className={s.subTitle}>
            Ссылка для восстановления пароля просрочена или уже использована.
          </p>
          <Link href={routes.forgotPassword}>
            <Button fullWidth size="lg" theme="ghost">
              Запросить снова
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  if (isSuccess) {
    return (
      <AuthCard>
        <div className={s.state}>
          <CheckCircle size={48} className={s.successIcon} />
          <h2 className={s.title}>Пароль изменён!</h2>
          <p className={s.subTitle}>
            Ваш пароль успешно обновлён. Перенаправление на вход...
          </p>
          <div className={s.progressBar}>
            <div className={s.progressFill} />
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className={s.header}>
        <span className={s.badge}>Новый пароль</span>
        <h2 className={s.title}>Создайте пароль</h2>
        <p className={s.subTitle}>
          Придумайте надёжный пароль (минимум 6 символов)
        </p>
      </div>

      <FormProvider {...methods}>
        <form className={s.form} onSubmit={methods.handleSubmit(onSubmit)}>
          <PasswordInput
            name="password"
            label="Новый пароль"
            placeholder="••••••••"
            size="md"
          />

          <PasswordInput
            name="confirmPassword"
            label="Подтвердите пароль"
            placeholder="••••••••"
            size="md"
          />

          <Button
            type="submit"
            className={s.button}
            fullWidth
            size="lg"
            disabled={isLoading || !methods.formState.isValid}
            loading={isLoading}
            theme="ghost"
          >
            {isLoading ? 'Сохраняем...' : 'Сохранить пароль'}
          </Button>
        </form>
      </FormProvider>
    </AuthCard>
  );
}

export const ResetPasswordView = () => {
  return (
    <div className={s.wrapper}>
      <Suspense
        fallback={
          <AuthCard>
            <div className={s.state}>
              <Loader2 size={32} className={s.spinner} />
              <p>Проверка ссылки...</p>
            </div>
          </AuthCard>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};
