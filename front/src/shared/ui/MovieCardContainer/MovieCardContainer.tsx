'use client';

import { useEffect, useState } from 'react';
import {
  useAddMovieMutation,
  useCheckMovieByKinopoiskIdQuery,
} from 'redux/search/moviesApi';
import { DayCard } from 'shared/ui/DayCard/DayCard';
import { MovieFormData } from 'shared/ui/MovieForm/MovieForm';
import { KinopoiskMovie } from 'redux/search/kinopoiskApi';

type Props = {
  movie: KinopoiskMovie | null;
};

export const MovieCardContainer = ({ movie }: Props) => {
  const { data: movieCheck } = useCheckMovieByKinopoiskIdQuery(movie?.id ?? 0, {
    skip: !movie,
  });

  const [addMovie, { isLoading: isSaving }] = useAddMovieMutation();
  const [actionStatus, setActionStatus] = useState<
    'idle' | 'want_to_watch' | 'watched'
  >('idle');

  useEffect(() => {
    if (!movieCheck) return;
    setActionStatus(movieCheck.exists ? movieCheck.status! : 'idle');
  }, [movieCheck]);

  if (!movie) return null;

  const handleWantToWatch = async () => {
    await addMovie({
      kinopoiskId: Number(movie.id),
      title: movie.name ?? movie.enName ?? 'Без названия',
      year: movie.year ?? new Date().getFullYear(),
      genre: movie.genres?.map((g) => g.name).join(', ') || '',
      posterUrl: movie.poster?.url || '',
      userRating: 0,
      status: 'want_to_watch',
      wouldRewatch: false,
      userComment: '',
    }).unwrap();
    setActionStatus('want_to_watch');
  };

  const handleWatched = async (
    _movie: KinopoiskMovie,
    formData: MovieFormData,
  ) => {
    await addMovie({
      kinopoiskId: Number(movie.id),
      title: movie.name ?? movie.enName ?? 'Без названия',
      year: movie.year ?? new Date().getFullYear(),
      genre: movie.genres?.map((g) => g.name).join(', ') || '',
      posterUrl: movie.poster?.url || '',
      userRating: formData.rating,
      status: 'watched',
      wouldRewatch: false,
      userComment: formData.comment,
      watchDate: formData.watchDate,
    }).unwrap();
    setActionStatus('watched');
  };

  return (
    <DayCard
      movie={movie}
      onWantToWatch={handleWantToWatch}
      onWatched={handleWatched}
      isSaving={isSaving}
      actionStatus={actionStatus}
    />
  );
};
