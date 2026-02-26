import { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Check } from 'lucide-react';

import { KinopoiskMovie } from 'redux/search/kinopoiskApi';
import { Button } from '../Button';
import { formatRating, getAgeBadge, formatDate, truncate } from './utils';
import s from './DayCard.module.scss';

interface Props {
  movie: KinopoiskMovie;
  onWantToWatch?: (movie: KinopoiskMovie) => void;
  onWatched?: (movie: KinopoiskMovie) => void;
  isSaving?: boolean;
  actionStatus?: 'idle' | 'want_to_watch' | 'watched';
}

export const DayCard = memo(
  ({ movie, onWantToWatch, onWatched, isSaving, actionStatus }: Props) => {
    const [imgLoaded, setImgLoaded] = useState(false);

    const title =
      movie.name || movie.alternativeName || movie.enName || 'Без названия';
    const subtitle =
      movie.alternativeName && movie.name !== movie.alternativeName
        ? `${movie.alternativeName} • ${movie.year ?? ''}`
        : movie.enName
          ? `${movie.enName} • ${movie.year ?? ''}`
          : '';

    const cast = useMemo(
      () =>
        movie.persons
          ?.filter(
            (p) =>
              ['актер', 'актриса'].includes(
                p.profession?.toLowerCase() ?? '',
              ) || p.enProfession?.toLowerCase() === 'actor',
          )
          ?.slice(0, 5) ?? [],
      [movie.persons],
    );

    return (
      <motion.article
        className={s.card}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={s.posterWrapper}>
          {!imgLoaded && <div className={s.skeleton} />}
          {movie.poster?.url && (
            <img
              className={`${s.poster} ${imgLoaded ? s.loaded : ''}`}
              src={movie.poster.url}
              alt={title || 'Постер'}
              onLoad={() => setImgLoaded(true)}
            />
          )}
          <div className={s.age}>{getAgeBadge(movie.ageRating)}</div>
          <div className={s.rating}>
            <span className={s.kp}>{formatRating(movie.rating?.kp)}</span>
          </div>
        </div>

        <div className={s.content}>
          <header>
            <h1 className={s.title}>{title}</h1>
            {subtitle && <div className={s.subtitle}>{subtitle}</div>}
          </header>

          <div className={s.meta}>
            {movie.movieLength && <span>{movie.movieLength} мин</span>}
            {!!movie.countries?.length && (
              <span>{movie.countries.map((c) => c.name).join(', ')}</span>
            )}
          </div>

          <div className={s.tags}>
            {movie.genres?.map((g) => (
              <span key={g.name} className={s.tag}>
                {g.name}
              </span>
            ))}
          </div>

          {movie.description && (
            <p className={s.description}>{truncate(movie.description, 200)}</p>
          )}

          {!!cast.length && (
            <div className={s.cast}>
              <div className={s.castTitle}>В главных ролях</div>
              <div className={s.castList}>
                {cast.map((actor) => (
                  <div key={actor.id} className={s.actor}>
                    {actor.photo && (
                      <img src={actor.photo} alt={actor.name || 'Актёр'} />
                    )}
                    <span>{actor.name || 'Неизвестно'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={s.footer}>
            {movie.premiere?.russia && (
              <span>Премьера: {formatDate(movie.premiere.russia)}</span>
            )}
            {!!movie.facts?.length && <span>Фактов: {movie.facts.length}</span>}
          </div>

          {/* Actions */}
          <div className={s.actions}>
            <AnimatePresence mode="wait">
              {actionStatus === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={s.buttonGroup}
                >
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
                    onClick={() => onWatched?.(movie)}
                    disabled={isSaving}
                  >
                    <Check size={16} />
                    Посмотрел
                  </Button>
                </motion.div>
              )}

              {actionStatus === 'want_to_watch' && (
                <motion.div
                  key="want_to_watch"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button size="sm" className={s.success}>
                    <Check size={16} /> В списке
                  </Button>
                </motion.div>
              )}

              {actionStatus === 'watched' && (
                <motion.div
                  key="watched"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button size="sm" className={s.success}>
                    <Check size={16} /> Просмотрено
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.article>
    );
  },
);
