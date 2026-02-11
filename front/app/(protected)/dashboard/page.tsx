import { type Metadata } from 'next';
import { getMetadata } from 'shared/lib/metadata';
import { routes } from 'shared/router/paths';

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    title: 'Logma — дневник фильмов и сериалов',
    description:
      'Logma — персональный дневник фильмов и сериалов. Сохраняй историю просмотров, ставь оценки и возвращайся к тому, что посмотрел.',
    url: routes.homepage,
  });
}

// Серверный компонент (async function допустима)
export default async function HomePage() {
  return <div>Dashboard</div>;
}
