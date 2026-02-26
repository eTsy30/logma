import { type Metadata } from 'next';
import { ErrorView } from 'pages/error';
import { getErrorMetadata } from 'pages/error/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return getErrorMetadata();
}

export default async function NotFoundPage() {
  return <ErrorView statusCode={404} />;
}
