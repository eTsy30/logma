'use client';

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
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ApiError {
  message?: string;
  error?: string;
  statusCode?: number;
}

export function RegistrationForm() {
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();
  const router = useRouter();

  const methods = useForm<RegistrationData>({
    mode: 'onTouched',
    resolver: zodResolver(RegistrationSchema),
  });

  const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError | undefined,
  ): string => {
    if (!error) return 'Произошла ошибка при регистрации';

    if ('data' in error) {
      const data = error.data as ApiError;
      return data?.message || data?.error || 'Произошла ошибка при регистрации';
    }

    if ('message' in error) {
      return error.message || 'Ошибка сети';
    }

    return 'Произошла ошибка при регистрации';
  };

  const onSubmit = async (data: RegistrationData) => {
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
      const message = getErrorMessage(
        error as FetchBaseQueryError | SerializedError,
      );
      methods.setError('root', { message });
    }
  };

  const {
    formState: { isValid, isSubmitting, errors },
  } = methods;

  return (
    <div className={s.wrapper}>
      <AuthCard>
        <div className={s.header}>
          <h2 className={s.title}>Создать аккаунт</h2>
          <p className={s.subTitle}>Начните вести свой кинодневник</p>
        </div>

        <FormProvider {...methods}>
          <form className={s.form} onSubmit={methods.handleSubmit(onSubmit)}>
            <Input
              name="name"
              label="Имя"
              placeholder="Как вас зовут?"
              size="md"
            />

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
              placeholder="Введите пароль"
              size="md"
              showStrength
            />

            {/* Показываем ошибку формы */}
            {errors.root && (
              <div className={s.errorMessage}>{errors.root.message}</div>
            )}

            <Button
              type="submit"
              className={s.button}
              fullWidth
              size="lg"
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
              theme="ghost"
            >
              {isSubmitting ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </Button>

            <div className={s.footer}>
              <span className={s.footerText}>Уже есть аккаунт?</span>
              <Link className={s.link} href={routes.login}>
                Войти
              </Link>
            </div>
          </form>
        </FormProvider>
      </AuthCard>
    </div>
  );
}
