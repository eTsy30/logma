import { createListenerMiddleware } from '@reduxjs/toolkit';
import { logout } from './slice';
import { authApi } from './api';

export const authMiddleware = createListenerMiddleware();

authMiddleware.startListening({
  actionCreator: logout,
  effect: async (_, api) => {
    try {
      await api.dispatch(authApi.endpoints.logout.initiate()).unwrap();
    } catch {}
    api.dispatch(authApi.util.resetApiState());
  },
});

export const { middleware } = authMiddleware;
