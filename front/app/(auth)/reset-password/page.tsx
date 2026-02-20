import { type Metadata } from 'next';
import { ResetPasswordView } from 'pages/reset-password';

import { getMetadata } from 'shared/lib/metadata';
import { routes } from 'shared/router/paths';

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    title: 'Сброс пароля',
    description: 'Сброс пароля',
    url: routes.login,
  });
}

export default async function Login() {
  return <ResetPasswordView />;
}
