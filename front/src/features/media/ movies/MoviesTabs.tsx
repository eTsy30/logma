'use client';

import { useMemo } from 'react';
import { Tabs } from 'shared/ui/Tabs';
import { MovieList } from 'features/movie-list';
import { useGetMyMoviesQuery } from 'redux/search/moviesApi';
import { MovieOfTheDay } from 'features/movie-day';

export const MoviesTabs = () => {
  const { data: myMovies = [], isLoading } = useGetMyMoviesQuery();

  const watchedMovies = useMemo(
    () => myMovies.filter((m) => m.status === 'watched'),
    [myMovies],
  );

  const willWatchMovies = useMemo(
    () => myMovies.filter((m) => m.status === 'want_to_watch'),
    [myMovies],
  );

  const tabs = useMemo(
    () => [
      {
        id: 'watched',
        label: `Смотрел (${watchedMovies.length})`,
        content: (
          <MovieList
            movies={watchedMovies}
            isLoading={isLoading}
            mode="watched"
          />
        ),
      },

      {
        id: 'will-watch',
        label: `Буду смотреть (${willWatchMovies.length})`,
        content: (
          <MovieList
            movies={willWatchMovies}
            isLoading={isLoading}
            mode="want_to_watch"
          />
        ),
      },
      {
        id: 'random',
        label: `Мне повезет`,
        content: <MovieOfTheDay />,
      },
    ],
    [watchedMovies, willWatchMovies, isLoading],
  );

  return <Tabs storageKey="films-subcategory" tabs={tabs} />;
};
