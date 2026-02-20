// features/movie-search/hooks/useMovieSearch.ts
'use client';

import { useState, useRef, useCallback } from 'react';
import { useLazySearchMoviesQuery } from 'redux/search/kinopoiskApi';
import { Movie } from 'shared/ui/MovieCard/MovieCard';
import { transformKinopoiskToMovie } from '../utils/utils';

export function useMovieSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQueryRef = useRef<string>('');

  const [triggerSearch, { isFetching, error }] = useLazySearchMoviesQuery();

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2 || searchQuery === lastQueryRef.current) {
        if (searchQuery.length < 2) setMovies([]);
        return;
      }

      lastQueryRef.current = searchQuery;

      try {
        const result = await triggerSearch(searchQuery).unwrap();
        if (result.docs) {
          const transformed = result.docs
            .filter((m) => m.poster?.url)
            .map(transformKinopoiskToMovie);
          setMovies(transformed);
        }
      } catch {
        setMovies([]);
      }
    },
    [triggerSearch],
  );

  const handleSetQuery = useCallback(
    (value: string) => {
      setQuery(value);
      setIsOpen(true);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.length < 2) {
        setMovies([]);
        lastQueryRef.current = '';
        return;
      }

      debounceRef.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    },
    [performSearch],
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setMovies([]);
    setIsOpen(false);
    lastQueryRef.current = '';
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  return {
    query,
    setQuery: handleSetQuery,
    isOpen,
    setIsOpen,
    movies,
    setMovies,
    isFetching,
    error,
    clearSearch,
  };
}
