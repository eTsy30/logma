import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';

import { API_URL } from 'shared/config/env';
import { setAccessToken, logout } from 'redux/auth/slice';
import { RootState } from './store';
import { authApi } from './auth/api';

export type QueryWithMeta = {
  meta?: {
    skipAuth?: boolean;
    skipReauth?: boolean;
  };
};

export type CustomFetchArgs = (FetchArgs & QueryWithMeta) | string;

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include', // ВАЖНО для cookie
  prepareHeaders: (headers, { getState, arg }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});
export const baseQueryWithReauth: BaseQueryFn<
  CustomFetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (typeof args !== 'string' && args?.meta?.skipReauth) {
    return result;
  }

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          const { accessToken } = refreshResult.data as { accessToken: string };

          api.dispatch(setAccessToken(accessToken));
          api.dispatch(authApi.endpoints.getMe.initiate());
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: () => ({}),
});
