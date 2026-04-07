import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from 'redux/auth/api';
import { tokenStorage } from 'shared/lib/tokenStorage';

type AuthState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: AuthUser | null;
  isInitialized: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  user: null,
  isInitialized: false,
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

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
      state.isAuthenticated = true;
      tokenStorage.setToken(action.payload);
    },

    logout(state) {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.user = null;
      tokenStorage.clear();
    },

    restoreToken(state) {
      const token = tokenStorage.getToken();
      if (token) {
        state.accessToken = token;
        state.isAuthenticated = true;
      }
      state.isInitialized = true;
    },

    hydrateAuth(state) {
      state.isInitialized = true;
    },

    setInitialized(state) {
      state.isInitialized = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
        state.user = filterMetaFields(action.payload);
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        tokenStorage.clear(); // ← очищаем при ошибке
      });
  },
});

export const {
  setAccessToken,
  logout,
  hydrateAuth,
  setInitialized,
  restoreToken,
} = authSlice.actions;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsInitialized = (state: { auth: AuthState }) =>
  state.auth.isInitialized;
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
