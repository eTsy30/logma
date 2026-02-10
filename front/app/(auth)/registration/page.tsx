import { type Metadata } from 'next';
import { getMetadata } from 'shared/lib/metadata';
import { routes } from 'shared/router/paths';

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    title: 'Logma Регистрация',
    description: 'Logma Регистрация',
    url: routes.registration,
  });
}

export default async function Registration() {
  return '<RegistrationView />';
}
