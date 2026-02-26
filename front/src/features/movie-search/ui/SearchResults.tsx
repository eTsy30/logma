'use client';

import { motion } from 'framer-motion';
import { MovieCard } from 'shared/ui/MovieCard';
import { Movie } from 'shared/ui/MovieCard/MovieCard';
import { Check } from 'lucide-react';
import s from './MovieSearch.module.scss';

interface Props {
  movies: Movie[];
  isFetching: boolean;
  error: unknown;
  query: string;
  isAlreadySaved: (id: string) => boolean;
  onSelect: (movie: Movie) => void;
}

export function SearchResults({
  movies,
  isFetching,
  error,
  query,
  isAlreadySaved,
  onSelect,
}: Props) {
  if (!query.length) return null;

  return (
    <motion.div
      className={s.dropdown}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {isFetching && <div className={s.dropdownMessage}>Поиск...</div>}
      {!!error && <div className={s.dropdownMessageError}>Ошибка загрузки</div>}
      {!isFetching && !error && movies.length === 0 && query.length >= 2 && (
        <div className={s.dropdownMessage}>Ничего не найдено</div>
      )}
      {movies.map((movie) => (
        <div key={movie.id} className={s.movieItem}>
          <MovieCard
            mode="search"
            movie={movie}
            onClick={() => !isAlreadySaved(movie.id) && onSelect(movie)}
          />
          {isAlreadySaved(movie.id) && (
            <span className={s.savedBadge}>
              <Check size={12} />
              Уже в коллекции
            </span>
          )}
        </div>
      ))}
    </motion.div>
  );
}
