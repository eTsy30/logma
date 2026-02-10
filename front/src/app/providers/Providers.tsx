'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

import { Provider } from 'react-redux';
import { store } from 'redux/store';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
