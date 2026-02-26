import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from 'redux/store';

export type MovieStatus = 'watched' | 'want_to_watch';

export interface UserMovie {
  id: string;
  kinopoiskId: number;
  title: string;
  year: number;
  genre: string;
  posterUrl: string;
  rating?: number;
  userRating?: number;
  status: MovieStatus;
  wouldRewatch: boolean;
  note?: string | null;
  userComment?: string | null;
  watchDate?: string | null;
  createdAt: string;
}

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Movies'],
  endpoints: (builder) => ({
    getMyMovies: builder.query<UserMovie[], void>({
      query: () => '/movies',
      providesTags: ['Movies'],
    }),

    addMovie: builder.mutation<UserMovie, Omit<UserMovie, 'id' | 'createdAt'>>({
      query: (body) => ({
        url: '/movies',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Movies'],
    }),

    updateMovie: builder.mutation<
      UserMovie,
      { id: string; data: Partial<UserMovie> }
    >({
      query: ({ id, data }) => ({
        url: `/movies/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Movies'],
    }),

    deleteMovie: builder.mutation<void, string>({
      query: (id) => ({
        url: `/movies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Movies'],
    }),

    checkMovieByKinopoiskId: builder.query<
      { exists: boolean; status?: 'watched' | 'want_to_watch' },
      number
    >({
      query: (kinopoiskId) => `/movies/by-kinopoisk/${kinopoiskId}/check`,
    }),
  }),
});

export const {
  useGetMyMoviesQuery,
  useAddMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useCheckMovieByKinopoiskIdQuery,
} = moviesApi;
