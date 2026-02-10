import { type Metadata } from 'next';

import { RecoveryView } from 'pages/recovery';
import { getMetadata } from 'shared/lib/metadata';
import { routes } from 'shared/router/paths';

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    title: 'Восстановление доступа',
    description: 'Введите почту, чтобы сбросить пароль.',
    url: routes.password,
  });
}

export default async function RecoveryPage() {
  return <RecoveryView />;
}
