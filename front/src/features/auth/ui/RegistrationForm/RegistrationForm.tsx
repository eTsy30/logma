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

  const methods = useForm<RegistrationData>({
    mode: 'onTouched',
    resolver: zodResolver(RegistrationSchema),
  });

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
      const message =
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при регистрации';
      methods.setError('root', { message });
    }
  };

  const {
    formState: { isValid, isSubmitting },
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
              size="md"
              showStrength
            />

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
