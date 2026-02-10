'use client';
import { type Metadata } from 'next';
import { ErrorPageProps, ErrorView } from 'pages/error';
import { getMetadata } from 'shared/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    title: 'Ошибка',
    url: '/',
  });
}

export default function Error({
  statusCode = 404,
  error = undefined,
}: { error?: Error } & ErrorPageProps) {
  return <ErrorView statusCode={statusCode} error={error} />;
}
