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
  credentials: 'include',
  prepareHeaders: (headers, { getState, endpoint }) => {
    const reduxToken = (getState() as RootState).auth.accessToken;
    const lsToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    const token = reduxToken || lsToken;

    console.log(`[API] prepareHeaders for "${endpoint}":`, {
      hasReduxToken: !!reduxToken,
      hasLsToken: !!lsToken,
      finalToken: !!token,
    });

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
      console.log('[API] Authorization header set');
    } else {
      console.log('[API] No token, skipping Authorization header');
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  CustomFetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  console.log(
    '[API] baseQueryWithReauth called:',
    typeof args === 'string' ? args : args.url,
  );

  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);
  console.log('[API] First request result:', {
    status: result.meta?.response?.status,
    hasError: !!result.error,
  });

  if (typeof args !== 'string' && args?.meta?.skipReauth) {
    console.log('[API] skipReauth=true, returning result');
    return result;
  }

  if (result.error?.status === 401) {
    console.log('[API] Got 401, attempting refresh');

    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      console.log('[API] Mutex acquired, calling /auth/refresh');

      try {
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
          } as CustomFetchArgs,
          api,
          { ...extraOptions, skipReauth: true },
        );

        console.log('[API] Refresh result:', {
          success: !!refreshResult.data,
          error: refreshResult.error,
        });

        if (refreshResult.data) {
          const { accessToken } = refreshResult.data as { accessToken: string };
          console.log('[API] Refresh successful, new token received');

          api.dispatch(setAccessToken(accessToken));

          result = await baseQuery(args, api, extraOptions);
          console.log('[API] Retry request result:', {
            status: result.meta?.response?.status,
            hasError: !!result.error,
          });
        } else {
          console.log('[API] Refresh failed, calling logout');
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      console.log('[API] Waiting for mutex unlock');
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
