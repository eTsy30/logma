import { type Metadata } from 'next';

import { ResetView } from 'pages/recovery';
import { getMetadata } from 'shared/lib/metadata';
import { type AsyncParams } from 'shared/lib/utils/types/types';
import { routes } from 'shared/router/paths';

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    title: 'Смена пароля',
    description: 'Введите новый пароль.',
    url: routes.recoverReset,
  });
}

export default async function ResetPage({ params }: AsyncParams<{ token: string }>) {
  const { token } = await params;

  return <ResetView token={token} />;
}
