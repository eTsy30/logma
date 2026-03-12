'use client';

import { memo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Check } from 'lucide-react';

import { KinopoiskMovie } from 'redux/search/kinopoiskApi';
import { Button } from '../Button';
import s from './DayCard.module.scss';
import { MovieFormData, MovieForm } from '../MovieForm/MovieForm';

interface Props {
  movie: KinopoiskMovie;
  onWantToWatch?: (movie: KinopoiskMovie) => void;
  onWatched?: (movie: KinopoiskMovie, formData: MovieFormData) => void;
  isSaving?: boolean;
  actionStatus?: 'idle' | 'want_to_watch' | 'watched';
}

export const DayCard = memo(
  ({ movie, onWantToWatch, onWatched, isSaving, actionStatus }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 768);
      check();
      window.addEventListener('resize', check);
      return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
      document.body.style.overflow = isModalOpen ? 'hidden' : '';
    }, [isModalOpen]);

    // Прокрутка к форме при открытии на мобильном
    useEffect(() => {
      if (isModalOpen && isMobile) {
        // Небольшая задержка для завершения анимации открытия
        const timer = setTimeout(() => {
          modalRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
          });
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [isModalOpen, isMobile]);

    const title =
      movie.name || movie.alternativeName || movie.enName || 'Без названия';

    const handleSubmit = (formData: MovieFormData) => {
      onWatched?.(movie, formData);
      setIsModalOpen(false);
    };

    return (
      <>
        <div className={s.card}>
          <div className={s.content}>
            <h1 className={s.title}>
              {title} {movie.year && `(${movie.year})`}
            </h1>

            <div className={s.actions}>
              {actionStatus === 'idle' && (
                <>
                  <Button
                    size="sm"
                    theme="ghost"
                    onClick={() => onWantToWatch?.(movie)}
                    disabled={isSaving}
                  >
                    <Bookmark size={16} />
                    Буду смотреть
                  </Button>

                  <Button
                    size="sm"
                    theme="primary"
                    onClick={() => setIsModalOpen(true)}
                    disabled={isSaving}
                  >
                    <Check size={16} />
                    Посмотрел
                  </Button>
                </>
              )}

              {actionStatus === 'watched' && (
                <Button size="sm" className={s.success}>
                  <Check size={16} /> Просмотрено
                </Button>
              )}
            </div>

            {isModalOpen && (
              <div className={s.hint}>
                Заполните оценку, комментарий и дату просмотра
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className={s.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                ref={modalRef}
                className={`${s.modal} ${isMobile ? s.bottomSheet : ''}`}
                initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
                animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
                exit={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <MovieForm
                  mode="create"
                  onCancel={() => setIsModalOpen(false)}
                  onSubmit={handleSubmit}
                  isLoading={isSaving}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  },
);
