'use client';

import { type ReactNode, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';

import { Provider } from 'react-redux';
import { store } from 'redux/store';
import { registerServiceWorker } from 'utils/registerServiceWorker';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
