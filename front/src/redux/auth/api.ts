import { api } from 'redux/api';
import { setAccessToken, logout } from './slice';

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ================= REGISTER =================
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
        meta: { skipAuth: true },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.accessToken));
        } catch {
          // dispatch(logout());
        }
      },
    }),

    // ================= LOGIN =================
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
        meta: { skipAuth: true },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.accessToken));
        } catch {
          // dispatch(logout());
        }
      },
    }),

    // ================= GET ME =================
    getMe: builder.query<User, void>({
      query: () => ({
        url: '/auth/@me',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
