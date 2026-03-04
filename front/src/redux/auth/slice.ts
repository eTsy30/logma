import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from 'redux/auth/api';

type AuthState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: AuthUser | null;
  isInitialized: boolean;
};

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('accessToken');
};

const initialState: AuthState = {
  accessToken: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', action.payload);
      }
    },

    logout(state) {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
    },

    hydrateAuth(state) {
      const token = getStoredToken();
      if (token) {
        state.accessToken = token;
        state.isAuthenticated = true;
      } else {
        state.isInitialized = true;
      }
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
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
      });
  },
});

export const { setAccessToken, logout, hydrateAuth, setInitialized } =
  authSlice.actions;
