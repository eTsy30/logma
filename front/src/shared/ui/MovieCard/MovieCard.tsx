'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cx from 'clsx';
import { Star, Calendar, X, Bookmark, Check, ChevronDown } from 'lucide-react';
import s from './MovieCard.module.scss';
import { Button } from '../Button';
import { MovieFormData, MovieForm } from '../MovieForm/MovieForm';

export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  posterUrl: string;
  rating?: number;
  wouldRewatch?: boolean;
  note?: string;
  watchDate?: string;
}

type MovieCardMode = 'search' | 'watched' | 'want_to_watch';

interface MovieCardProps {
  movie: Movie;
  mode?: MovieCardMode;
  isAlreadySaved?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  className?: string;

  onWantToWatch?: () => void;
  onSaveWatched?: (data: MovieFormData) => void;
  onRemove?: () => void;
  isLoading?: boolean;
}

export function MovieCard({
  movie,
  mode = 'search',
  isAlreadySaved,
  isExpanded: externalExpanded,
  onToggle,
  onClick,
  className,
  onWantToWatch,
  onSaveWatched,
  onRemove,
  isLoading,
}: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const isExpanded = externalExpanded ?? internalExpanded;
  const isSearch = mode === 'search';
  const isWatched = mode === 'watched';
  const isWantToWatch = mode === 'want_to_watch';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const handleToggle = () => {
    if (onToggle) onToggle();
    else setInternalExpanded(!internalExpanded);
  };

  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleWantToWatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWantToWatch?.();
  };

  const handleShowForm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    if (!isSearch) setInternalExpanded(false);
  };

  const handleSubmitForm = (data: MovieFormData) => {
    onSaveWatched?.(data);
    setShowForm(false);
  };

  const hasNote = !!movie.note && movie.note.length > 0;
  const showActions =
    isSearch && !isAlreadySaved && onWantToWatch && onSaveWatched;

  return (
    <motion.div
      className={cx(
        s.card,
        s[mode],
        (isExpanded || showForm) && s.expanded,
        className,
      )}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={isSearch ? handleClick : undefined}
    >
      <div
        className={s.mainRow}
        onClick={!isSearch && !showForm ? handleToggle : undefined}
      >
        {/* Row 1: Poster + Title/Year/Genre */}
        <div className={s.row1}>
          <div className={cx(s.posterWrap, isSearch && s.posterLarge)}>
            {!imageLoaded && <div className={s.skeleton} />}
            <img
              src={movie.posterUrl}
              alt={movie.title || 'Постер'}
              className={cx(s.poster, imageLoaded && s.loaded)}
              onLoad={() => setImageLoaded(true)}
            />
            {isSearch && <div className={s.glow} />}
          </div>

          <div className={s.info}>
            <div className={s.titleWrap}>
              <h3 className={s.title}>{movie.title}</h3>
              <span className={s.meta}>
                {movie.year} • {movie.genre}
              </span>
              {(movie.rating ?? 0) > 0 && (
                <div className={s.rating}>
                  <div className={s.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={cx(
                          s.star,
                          star <= (movie.rating ?? 0) && s.starActive,
                        )}
                        fill={
                          star <= (movie.rating ?? 0) ? 'currentColor' : 'none'
                        }
                      />
                    ))}
                  </div>
                  <span className={s.ratingValue}>{movie.rating}/5</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Rating + Date + Rewatch badge + Chevron */}
        <div className={s.row2}>
          <div className={s.row2Content}>
            {movie.watchDate && (
              <div className={s.date}>
                <Calendar size={14} />
                <span>{formatDate(movie.watchDate)}</span>
              </div>
            )}
          </div>

          {/* Chevron для watched режима с note */}
          {isWatched && hasNote && !showForm && (
            <ChevronDown
              size={20}
              className={cx(s.chevron, isExpanded && s.chevronRotated)}
            />
          )}
        </div>

        {isSearch && onToggle && (
          <button
            className={s.closeBtn}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Row 3: Actions */}
      {showActions && (
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="actions"
              className={s.actions}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                size="sm"
                theme="ghost"
                onClick={handleWantToWatch}
                disabled={isLoading}
              >
                <Bookmark size={16} />
                Буду смотреть
              </Button>
              <Button size="sm" theme="primary" onClick={handleShowForm}>
                <Check size={16} />
                Посмотрел
              </Button>
            </motion.div>
          ) : (
            <MovieForm
              key="form"
              mode="create"
              onCancel={handleCancelForm}
              onSubmit={handleSubmitForm}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>
      )}

      {/* Note (раскрывается) */}
      {isWatched && hasNote && !showForm && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className={s.noteWrap}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className={s.note}>
                <p>{movie.note}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Want to watch mode */}
      {isWantToWatch && (
        <AnimatePresence mode="wait">
          {!showForm ? (
            isExpanded && (
              <motion.div
                key="actions"
                className={s.quickActions}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <Button theme="primary" size="sm" onClick={handleShowForm}>
                  <Check size={16} />
                  Посмотрел
                </Button>
                <Button
                  theme="ghost"
                  size="sm"
                  onClick={onRemove}
                  disabled={isLoading}
                >
                  <X size={16} />
                  Убрать
                </Button>
              </motion.div>
            )
          ) : (
            <MovieForm
              key="form"
              mode="create"
              onCancel={handleCancelForm}
              onSubmit={handleSubmitForm}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
