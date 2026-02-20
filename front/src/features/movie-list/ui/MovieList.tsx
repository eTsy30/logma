'use client';

import { MovieCard } from 'shared/ui/MovieCard';
import {
  UserMovie,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} from 'redux/search/moviesApi';

import s from './MovieList.module.scss';
import { MovieFormData } from 'shared/ui/MovieForm/MovieForm';

interface MovieListProps {
  movies: UserMovie[];
  isLoading?: boolean;
  mode: 'watched' | 'want_to_watch';
}

export const MovieList = ({ movies, isLoading, mode }: MovieListProps) => {
  const [updateMovie, { isLoading: isUpdating }] = useUpdateMovieMutation();
  const [deleteMovie, { isLoading: isDeleting }] = useDeleteMovieMutation();

  if (isLoading) return <div className={s.loading}>Загрузка...</div>;
  if (movies.length === 0) return <div className={s.empty}>Нет фильмов</div>;

  const handleSaveWatched = async (movie: UserMovie, data: MovieFormData) => {
    try {
      await updateMovie({
        id: movie.id,
        data: {
          status: 'watched',
          userRating: data.rating,
          watchDate: data.watchDate,
          userComment: data.comment,
        },
      }).unwrap();
    } catch (err) {
      console.error('Failed to mark as watched:', err);
    }
  };

  return (
    <div className={s.list}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          mode={mode}
          movie={{
            id: movie.id,
            title: movie.title,
            year: movie.year,
            genre: movie.genre,
            posterUrl: movie.posterUrl,
            rating: movie.userRating ?? 0,
            wouldRewatch: movie.wouldRewatch,
            note: movie.userComment ?? undefined,
            watchDate: movie.watchDate ?? '',
          }}
          onSaveWatched={(data) => handleSaveWatched(movie, data)}
          onRemove={() => deleteMovie(movie.id)}
          isLoading={isUpdating || isDeleting}
        />
      ))}
    </div>
  );
};
