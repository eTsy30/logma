import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from 'redux/store';
export interface KinopoiskMovie {
  id: number;
  name: string;
  alternativeName?: string;
  year: number;
  description?: string;
  shortDescription?: string;
  genres: { name: string }[];
  countries: { name: string }[];
  poster?: {
    url: string;
    previewUrl: string;
  };
  rating?: {
    kp: number;
    imdb: number;
  };
  movieLength?: number;
  type: string;
}

export interface KinopoiskSearchResponse {
  docs: KinopoiskMovie[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export const kinopoiskApi = createApi({
  reducerPath: 'kinopoiskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/kinopoisk`, // ваш backend URL
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    searchMovies: builder.query<KinopoiskSearchResponse, string>({
      query: (query) => ({
        url: '/search',
        params: { query, limit: 10 },
      }),
      keepUnusedDataFor: 60,
    }),

    getMovieById: builder.query<KinopoiskMovie, number>({
      query: (id) => `/movie/${id}`,
    }),
  }),
});

export const { useSearchMoviesQuery, useLazySearchMoviesQuery } = kinopoiskApi;
