import { createListenerMiddleware } from '@reduxjs/toolkit';

import { routes } from 'shared/router/paths';
import { logout } from './slice';

export const authMiddleware = createListenerMiddleware();

authMiddleware.startListening({
  actionCreator: logout,
  effect: (action) => {
    if (typeof window === 'undefined') return;

    const loginUrl = `${window.location.origin}${routes.login}`;
    const redirectUrl = `${loginUrl}?redirect=${window.location.href}`;

    if (window.location.href !== redirectUrl) {
      window.location.assign(redirectUrl);
    }
  },
});
