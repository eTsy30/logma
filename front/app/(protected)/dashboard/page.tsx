import { type Metadata } from 'next';
import { DashboardView } from 'pages/dash-board/ui';
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
export default async function Dashboard() {
  return <DashboardView />;
}
