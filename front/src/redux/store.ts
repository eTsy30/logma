import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { authMiddleware } from './auth/middleware';
import { api } from './api';
import { authSlice } from './auth/slice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(authMiddleware.middleware)
      .concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
