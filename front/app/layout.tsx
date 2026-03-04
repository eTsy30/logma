import '../src/app/styles/normalize.css';
import '../src/app/styles/variables.scss';
import '../src/app/styles/theme.scss';
import '../src/app/styles/app.scss';
import { type ReactNode } from 'react';
import { type Metadata, type Viewport } from 'next';
import { getMetadata } from 'shared/lib/metadata';
import { routes } from 'shared/router/paths';
import { Providers } from 'app/providers/Providers';
import { inter } from 'app/fonts';
import { AuthGuard } from 'shared/providers/AuthGuard';
import { ServiceWorkerProvider } from 'shared/providers/ServiceWorkerProvider';

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...getMetadata({ url: routes.homepage }),
    manifest: '/favicon/site.webmanifest',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Logma',
    },
    icons: {
      icon: '/web-app-manifest-192x192.png',
      apple: '/web-app-manifest-192x192.png',
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0f172a', // ← добавь
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" data-scroll-behavior="smooth">
      <body className={inter.variable}>
        <ServiceWorkerProvider />
        <Providers>
          <AuthGuard>{children}</AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
