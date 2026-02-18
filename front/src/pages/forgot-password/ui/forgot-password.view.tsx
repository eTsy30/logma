'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from 'shared/ui/Inputs';
import { Button } from 'shared/ui/Button';
import Link from 'next/link';
import { routes } from 'shared/router/paths';
import { useForgotPasswordMutation } from 'redux/auth/api';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import s from './forgot-password.module.scss';
import { AuthCard } from 'features/auth';
import { ForgotFormData, ForgotSchema } from '../model/fogot.types';

export const ForgotPasswordView = () => {
  const [isSent, setIsSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const methods = useForm<ForgotFormData>({
    mode: 'onTouched',
    resolver: zodResolver(ForgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    try {
      await forgotPassword(data).unwrap();
      setIsSent(true);
    } catch {
      setIsSent(true);
    }
  };

  if (isSent) {
    return (
      <div className={s.wrapper}>
        <AuthCard>
          <div className={s.successState}>
            <CheckCircle className={s.successIcon} size={48} />
            <h2 className={s.title}>Письмо отправлено!</h2>
            <p className={s.subTitle}>
              На указанный email отправлена инструкция по восстановлению пароля.
              Ссылка действительна 15 минут.
            </p>
            <Link href={routes.login} className={s.backLink}>
              <ArrowLeft size={16} />
              Вернуться к входу
            </Link>
          </div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className={s.wrapper}>
      <AuthCard>
        <div className={s.header}>
          <h2 className={s.title}>Забыли пароль?</h2>
          <p className={s.subTitle}>
            Введите email, и мы отправим ссылку <br /> для сброса пароля
          </p>
        </div>

        <FormProvider {...methods}>
          <form className={s.form} onSubmit={methods.handleSubmit(onSubmit)}>
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="user@example.com"
              size="md"
              iconLeft={<Mail size={20} />}
            />

            <Button
              type="submit"
              className={s.button}
              fullWidth
              size="lg"
              disabled={isLoading}
              loading={isLoading}
              theme="ghost"
            >
              {isLoading ? 'Отправляем...' : 'Отправить ссылку'}
            </Button>

            <div className={s.footer}>
              <Link href={routes.login} className={s.link}>
                Я помню пароль
              </Link>
            </div>
          </form>
        </FormProvider>
      </AuthCard>
    </div>
  );
};
