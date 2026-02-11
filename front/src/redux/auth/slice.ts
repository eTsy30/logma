import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { authApi } from 'redux/auth/api';

type AuthState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: AuthUser | null;
};

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  user: null,
};
export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

// Фильтрую свойства, начинающиеся с '@' что бы не тянуть тех. поля
const filterMetaFields = (payload: Record<string, unknown>): AuthUser =>
  Object.fromEntries(
    Object.entries(payload).filter(([key]) => !key.startsWith('@')),
  ) as AuthUser;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        const user = action.payload;

        state.user = filterMetaFields(user);
      },
    );
  },
});

export const { setAccessToken, logout } = authSlice.actions;
