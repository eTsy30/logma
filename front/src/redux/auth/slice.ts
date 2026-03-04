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
    console.log('[AUTH_SLICE] getStoredToken: window undefined');
    return null;
  }
  const token = localStorage.getItem('accessToken');
  console.log(
    '[AUTH_SLICE] getStoredToken:',
    token ? `found (${token.substring(0, 20)}...)` : 'not found',
  );
  return token;
};

const initialState: AuthState = {
  accessToken: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
  user: null,
  isInitialized: false,
};

console.log('[AUTH_SLICE] Initial state:', {
  hasToken: !!initialState.accessToken,
  isAuthenticated: initialState.isAuthenticated,
  isInitialized: initialState.isInitialized,
});

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
      console.log('[AUTH_SLICE] setAccessToken called');
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', action.payload);
        console.log('[AUTH_SLICE] Token saved to localStorage');
      }
    },

    logout(state) {
      console.log('[AUTH_SLICE] logout called');
      state.accessToken = null;
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        console.log('[AUTH_SLICE] Token removed from localStorage');
      }
    },

    hydrateAuth(state) {
      console.log('[AUTH_SLICE] hydrateAuth called, current state:', {
        hasToken: !!state.accessToken,
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
      });
      const token = getStoredToken();
      if (token) {
        console.log(
          '[AUTH_SLICE] hydrateAuth: restoring token from localStorage',
        );
        state.accessToken = token;
        state.isAuthenticated = true;
        // 🔥 ВАЖНО: Не трогаем isInitialized здесь, пусть getMe его установит
      } else {
        console.log('[AUTH_SLICE] hydrateAuth: no token in localStorage');
        // 🔥 Если токена нет, сразу считаем инициализацию завершенной
        state.isInitialized = true;
      }
    },

    // 🔥 Новый экшен для принудительной установки isInitialized
    setInitialized(state) {
      console.log('[AUTH_SLICE] setInitialized called');
      state.isInitialized = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
        console.log('[AUTH_SLICE] getMe.matchFulfilled:', action.payload);
        state.user = filterMetaFields(action.payload);
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state, action) => {
        console.log('[AUTH_SLICE] getMe.matchRejected:', action.error);
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          console.log('[AUTH_SLICE] Token removed due to getMe rejection');
        }
      });
  },
});

export const { setAccessToken, logout, hydrateAuth, setInitialized } =
  authSlice.actions;
