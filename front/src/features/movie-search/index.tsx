'use client';

import { useState, useRef, useEffect } from 'react';
import {
  useAddMovieMutation,
  useGetMyMoviesQuery,
} from 'redux/search/moviesApi';
import { Movie, MovieCard } from 'shared/ui/MovieCard/MovieCard';
import { useMovieSearch } from './hooks/useMovieSearch';
import s from './ui/MovieSearch.module.scss';
import { AnimatePresence } from 'framer-motion';

import { SearchInput } from './ui/SearchInput';
import { SearchResults } from './ui/SearchResults';
import { MovieFormData } from 'shared/ui/MovieForm/MovieForm';

export function MovieSearch({ onBack }: { onBack?: () => void }) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    movies,
    setMovies,
    isFetching,
    error,
  } = useMovieSearch();
  const [addMovie, { isLoading: isSaving }] = useAddMovieMutation();
  const { data: myMovies, refetch } = useGetMyMoviesQuery();

  const isAlreadySaved = (kinopoiskId: string | number) => {
    return !!myMovies?.some(
      (m) => String(m.kinopoiskId) === String(kinopoiskId),
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setQuery(movie.title);
    setIsOpen(false);
    setMovies([]);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedMovie(null);
    setMovies([]);
  };

  const handleWantToWatch = async () => {
    if (!selectedMovie || isAlreadySaved(selectedMovie.id)) return;
    try {
      await addMovie({
        kinopoiskId: parseInt(selectedMovie.id),
        title: selectedMovie.title,
        year: selectedMovie.year,
        genre: selectedMovie.genre,
        posterUrl: selectedMovie.posterUrl,
        userRating: 0,
        status: 'want_to_watch',
        wouldRewatch: false,
        userComment: '',
      }).unwrap();
      refetch();
      handleClear();
    } catch (err) {
      console.error('Failed to save movie:', err);
    }
  };

  const handleSaveWatched = async (data: MovieFormData) => {
    if (!selectedMovie) return;
    try {
      await addMovie({
        kinopoiskId: parseInt(selectedMovie.id),
        title: selectedMovie.title,
        year: selectedMovie.year,
        genre: selectedMovie.genre,
        posterUrl: selectedMovie.posterUrl,
        userRating: data.rating,
        status: 'watched',
        userComment: data.comment,
        watchDate: data.watchDate,
        wouldRewatch: false,
      }).unwrap();
      refetch();
      handleClear();
    } catch (err) {
      console.error('Failed to save movie:', err);
    }
  };

  const showDropdown = isOpen && (query.length >= 2 || isFetching || error);

  return (
    <div className={s.container} ref={containerRef}>
      <SearchInput
        query={query}
        isFetching={isFetching}
        onChange={setQuery}
        onFocus={() => setIsOpen(true)}
        onClear={handleClear}
        onBack={onBack}
      />

      <AnimatePresence>
        {showDropdown && (
          <SearchResults
            movies={movies}
            isFetching={isFetching}
            error={error}
            query={query}
            isAlreadySaved={isAlreadySaved}
            onSelect={handleSelect}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMovie && (
          <div className={s.selectedMovie}>
            <MovieCard
              mode="search"
              movie={selectedMovie}
              isAlreadySaved={isAlreadySaved(selectedMovie.id)}
              onToggle={handleClear}
              onWantToWatch={handleWantToWatch}
              onSaveWatched={handleSaveWatched}
              isLoading={isSaving}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
