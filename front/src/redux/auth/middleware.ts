import { createListenerMiddleware } from '@reduxjs/toolkit';
import { logout } from './slice';
import { authApi } from './api';

export const authMiddleware = createListenerMiddleware();

authMiddleware.startListening({
  actionCreator: logout,
  effect: async (_, api) => {
    api.dispatch(authApi.util.resetApiState());
  },
});
