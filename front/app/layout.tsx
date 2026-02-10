import '../src/app/styles/variables.scss';
import '../src/app/styles/app.scss';
import '../src/app/styles/theme.scss';
import '../src/app/styles/normalize.css';
import { type ReactNode } from 'react';
import { type Metadata, type Viewport } from 'next';
import { getMetadata } from 'shared/lib/metadata';
import { routes } from 'shared/router/paths';
import { Providers } from 'app/providers/Providers';
import { inter } from 'app/fonts';

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({ url: routes.homepage });
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" data-scroll-behavior="smooth">
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
