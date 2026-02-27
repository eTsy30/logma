import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from 'redux/store';

// Обновлённые интерфейсы согласно API
export interface KinopoiskMovie {
  id: number;
  name?: string;
  alternativeName?: string;
  enName?: string;
  year?: number;
  description?: string;
  shortDescription?: string;
  rating?: {
    kp?: number;
    imdb?: number;
  };
  movieLength?: number;
  ageRating?: number;
  poster?: {
    url?: string;
    previewUrl?: string;
  };
  genres: { name: string }[];
  countries: { name: string }[];
  persons?: {
    id: number;
    name?: string;
    enName?: string;
    photo?: string;
    profession?: string;
    enProfession?: string;
  }[];
  premiere?: {
    russia?: string;
  };
  facts?: {
    value: string;
    type?: string;
    spoiler?: boolean;
  }[];
}

export interface MovieFact {
  value: string;
  type: 'FACT' | 'BLOOPER';
  spoiler: boolean;
}

export interface MovieOfTheDay {
  movie: KinopoiskMovie;
  facts: MovieFact[];
  cachedAt: string;
  expiresAt: string;
}

export interface KinopoiskSearchResponse {
  docs: KinopoiskMovie[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

// Ответ от /movie-of-the-day
export interface MovieOfTheDayResponse {
  success: boolean;
  data: MovieOfTheDay;
  meta: {
    expiresIn: number;
  };
}
export interface RandomMovieResponse {
  success: boolean;
  data: KinopoiskMovie;
}

export const kinopoiskApi = createApi({
  reducerPath: 'kinopoiskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/kinopoisk`,
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
    // Существующие эндпоинты
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

    getRandomMovie: builder.query<RandomMovieResponse, void>({
      query: () => '/random',
    }),

    // НОВЫЙ: Получить фильм дня (с кэшем на стороне клиента)
    getMovieOfTheDay: builder.query<MovieOfTheDayResponse, void>({
      query: () => '/movie-of-the-day',
      // Не кэшируем долго — бэкенд сам управляет кэшем
      keepUnusedDataFor: 300, // 5 минут
    }),

    // НОВЫЙ: Принудительное обновление фильма дня (только для админов)
    refreshMovieOfTheDay: builder.mutation<
      MovieOfTheDayResponse,
      { secret: string }
    >({
      query: (body) => ({
        url: '/movie-of-the-day/refresh',
        method: 'POST',
        body,
      }),
    }),
  }),
});

// Экспортируем хуки
export const {
  useSearchMoviesQuery,
  useLazySearchMoviesQuery,
  useGetMovieByIdQuery,
  useLazyGetMovieByIdQuery,
  // Новые хуки
  useGetRandomMovieQuery,
  useLazyGetRandomMovieQuery,
  useGetMovieOfTheDayQuery,
  useLazyGetMovieOfTheDayQuery,
  useRefreshMovieOfTheDayMutation,
} = kinopoiskApi;
