// components/MovieForm/MovieForm.tsx
'use client';

import { useState } from 'react';
import cx from 'clsx';
import { motion } from 'framer-motion';
import { Star, X, RotateCcw } from 'lucide-react';
import { Button } from 'shared/ui/Button';
import { useUpdateMovieMutation } from 'redux/search/moviesApi';
import type { UserMovie } from 'redux/search/moviesApi';
import s from './MovieForm.module.scss';

export interface MovieFormData {
  rating: number;
  watchDate: string;
  comment: string;
  wouldRewatch: boolean;
}

interface MovieFormProps {
  mode?: 'create' | 'edit';
  initialData?: Partial<MovieFormData>;
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: MovieFormData) => void;
  movie?: UserMovie;
  onSave?: () => void;
}

export function MovieForm(props: MovieFormProps) {
  const isEditMode = 'movie' in props && props.movie !== undefined;
  const {
    mode = isEditMode ? 'edit' : 'create',
    initialData,
    isLoading: externalLoading,
    onCancel,
    onSubmit: externalOnSubmit,
    movie,
    onSave,
  } = props;

  const [updateMovie, { isLoading: updateLoading }] = useUpdateMovieMutation();
  const isLoading = externalLoading || updateLoading;

  const [rating, setRating] = useState(
    (movie?.userRating ?? initialData?.rating) || 0,
  );
  const today = new Date().toISOString().slice(0, 10);
  const [watchDate, setWatchDate] = useState<string>(
    (movie?.watchDate?.split('T')[0] ?? initialData?.watchDate) || today,
  );
  const [comment, setComment] = useState(
    (movie?.userComment ?? initialData?.comment) || '',
  );
  const [wouldRewatch, setWouldRewatch] = useState(
    movie?.wouldRewatch ?? initialData?.wouldRewatch ?? false,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const formData: MovieFormData = {
      rating,
      watchDate,
      comment,
      wouldRewatch,
    };

    if (isEditMode && movie) {
      await updateMovie({
        id: movie.id,
        data: {
          userRating: formData.rating,
          watchDate: formData.watchDate,
          wouldRewatch: formData.wouldRewatch,
          userComment: formData.comment || undefined,
        },
      });
      onSave?.();
    } else {
      externalOnSubmit?.(formData);
    }
  };

  return (
    <motion.form
      className={s.form}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
    >
      <div className={s.watchedBlock}>
        <div className={s.row}>
          <div className={s.ratingWrap}>
            <div className={s.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={cx(s.star, rating >= star && s.starActive)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={18}
                    fill={rating >= star ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>
            <span className={s.ratingValue}>
              {rating > 0 ? `${rating}/5` : 'Оцените'}
            </span>
          </div>

          <div className={s.dateWrap}>
            <input
              type="date"
              value={watchDate}
              onChange={(e) => setWatchDate(e.target.value)}
              className={s.dateInput}
              required
            />
          </div>
        </div>

        <div className={s.commentWrap}>
          <textarea
            rows={5}
            cols={33}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Комментарий..."
            className={s.commentInput}
          />
        </div>

        <div className={s.actions}>
          <Button
            theme="ghost"
            size="sm"
            type="submit"
            className={s.saveBtn}
            onClick={onCancel}
          >
            Отменить
          </Button>
          <Button
            theme="primary"
            size="sm"
            type="submit"
            disabled={isLoading || rating === 0}
            loading={isLoading}
            className={s.saveBtn}
          >
            {mode === 'create' ? 'Добавить' : 'Сохранить'}
          </Button>
        </div>
      </div>
    </motion.form>
  );
}
