import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Настройки базового API
export const baseApi = createApi({
  reducerPath: 'baseApi', // ключ в Redux store
  baseQuery: fetchBaseQuery({
    baseUrl: (() => {
      const url = process.env.NEXT_PUBLIC_API_URL;
      if (url) {
        return url;
      }
      if (process.env.NODE_ENV === 'production') {
        throw new Error('NEXT_PUBLIC_API_URL environment variable is not set in production');
      }
      return 'http://localhost:3000/api';
    })(),
    prepareHeaders: (headers) => {
      // Если нужен токен:
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  //tagTypes: ['User', 'Post'], // теги для автоматического кеширования
  endpoints: () => ({}), // пока пусто, можно добавлять позже
});

export default baseApi;
