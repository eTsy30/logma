import { createListenerMiddleware } from '@reduxjs/toolkit';
import { logout } from './slice';
import { authApi } from './api';

export const authMiddleware = createListenerMiddleware();

authMiddleware.startListening({
  actionCreator: logout,
  effect: async (_, api) => {
    // Вызываем logout на сервере для очистки куков
    try {
      await api.dispatch(authApi.endpoints.logout.initiate()).unwrap();
    } catch {
      // Продолжаем очистку даже при ошибке
    }
    // Сбрасываем состояние API
    api.dispatch(authApi.util.resetApiState());
  },
});

export const { middleware } = authMiddleware;
