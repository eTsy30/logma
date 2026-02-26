'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  useGetMovieOfTheDayQuery,
  KinopoiskMovie,
} from 'redux/search/kinopoiskApi';
import {
  useAddMovieMutation,
  useCheckMovieByKinopoiskIdQuery,
} from 'redux/search/moviesApi';

import { DayCard } from 'shared/ui/DayCard/DayCard';
import { MovieForm, MovieFormData } from 'shared/ui/MovieForm/MovieForm';
import s from './MovieOfTheDay.module.scss';

export const MovieOfTheDay = () => {
  const { data } = useGetMovieOfTheDayQuery();
  const movie = data?.data?.movie ?? null;

  const { data: movieCheck } = useCheckMovieByKinopoiskIdQuery(movie?.id ?? 0, {
    skip: !movie,
  });
  const [addMovie, { isLoading: isSaving }] = useAddMovieMutation();
  const [actionStatus, setActionStatus] = useState<
    'idle' | 'want_to_watch' | 'watched'
  >('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<KinopoiskMovie | null>(
    null,
  );
  useEffect(() => {
    if (!movieCheck) return;

    if (!movieCheck.exists) setActionStatus('idle');
    else setActionStatus(movieCheck.status!);
  }, [movieCheck]);
  if (!movie) return null;
  const handleWantToWatch = async (movie: KinopoiskMovie) => {
    try {
      await addMovie({
        kinopoiskId: Number(movie.id),
        title: movie.name ?? movie.enName ?? 'Без названия',
        year: movie.year ?? new Date().getFullYear(),
        genre: movie.genres?.map((g) => g.name).join(', ') || '',
        posterUrl: movie.poster?.url ?? '',
        userRating: 0,
        status: 'want_to_watch',
        wouldRewatch: false,
        userComment: '',
      }).unwrap();

      setActionStatus('want_to_watch');
    } catch (e) {
      console.error(e);
    }
  };

  const handleWatched = (movie: KinopoiskMovie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleSubmitWatched = async (formData: MovieFormData) => {
    if (!selectedMovie) return;

    try {
      await addMovie({
        kinopoiskId: Number(selectedMovie.id),
        title: selectedMovie.name ?? selectedMovie.enName ?? 'Без названия',
        year: selectedMovie.year ?? new Date().getFullYear(),
        genre: selectedMovie.genres?.map((g) => g.name).join(', ') || '',
        posterUrl: selectedMovie.poster?.url ?? '',
        userRating: formData.rating,
        status: 'watched',
        wouldRewatch: false,
        userComment: formData.comment,
        watchDate: formData.watchDate,
      }).unwrap();

      setActionStatus('watched');
      setIsModalOpen(false);
      setSelectedMovie(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className={s.movie}>
        <DayCard
          movie={movie}
          onWantToWatch={handleWantToWatch}
          onWatched={handleWatched}
          isSaving={isSaving}
          actionStatus={actionStatus}
        />
        {/* <RandomMovieButton /> */}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className={s.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className={s.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <MovieForm
                mode="create"
                onCancel={() => setIsModalOpen(false)}
                onSubmit={handleSubmitWatched}
                isLoading={isSaving}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
