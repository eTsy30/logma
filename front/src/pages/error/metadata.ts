import { getMetadata } from 'shared/lib/metadata';

export async function getErrorMetadata() {
  return getMetadata({
    title: 'Страница не найдена',
    description: 'Страница не найдена',
    url: '/',
  });
}
