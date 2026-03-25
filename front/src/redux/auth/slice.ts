import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from 'redux/auth/api';

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
    },

    logout(state) {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.user = null;
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
      });
  },
});

export const { setAccessToken, logout, hydrateAuth, setInitialized } =
  authSlice.actions;
