import { type Metadata } from 'next';
import { ForgotPasswordView } from 'pages/forgot-password/ui/forgot-password.view';

import { getMetadata } from 'shared/lib/metadata';
import { routes } from 'shared/router/paths';

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    title: 'Забыли пароль',
    description: 'Востановление пароля',
    url: routes.login,
  });
}

export default async function Login() {
  return <ForgotPasswordView />;
}
