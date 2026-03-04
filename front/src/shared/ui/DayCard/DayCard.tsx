import { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Check, ChevronDown } from 'lucide-react';

import { KinopoiskMovie } from 'redux/search/kinopoiskApi';
import { Button } from '../Button';
import { formatRating, getAgeBadge } from './utils';
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
    const [imgLoaded, setImgLoaded] = useState(false);
    const [factsOpen, setFactsOpen] = useState(false);
    const [descriptionOpen, setDescriptionOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const title =
      movie.name || movie.alternativeName || movie.enName || 'Без названия';

    const cast = useMemo(
      () =>
        movie.persons
          ?.filter(
            (p) =>
              ['актер', 'актриса'].includes(
                p.profession?.toLowerCase() ?? '',
              ) || p.enProfession?.toLowerCase() === 'actor',
          )
          ?.slice(0, 4) ?? [],
      [movie.persons],
    );

    const handleWatchedClick = () => {
      setIsModalOpen(true);
    };

    const handleSubmit = (formData: MovieFormData) => {
      onWatched?.(movie, formData);
      setIsModalOpen(false);
    };

    return (
      <>
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="modalOverlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                className="modalContent"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
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

        <motion.article
          className={s.card}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={s.posterWrapper}>
            {!imgLoaded && <div className={s.skeleton} />}
            {movie.poster?.url && movie.poster.url.trim() !== '' && (
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
              <h1 className={s.title}>
                {`${title}${movie.year ? ` (${movie.year})` : ''}`}
              </h1>
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
              <div className={s.factsWrapper}>
                <button
                  className={s.factsToggle}
                  onClick={() => setDescriptionOpen(!descriptionOpen)}
                  type="button"
                >
                  <span>О фильме</span>
                  <motion.span
                    animate={{ rotate: descriptionOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {descriptionOpen && (
                    <motion.ul
                      className={s.factsList}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <motion.li
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 * 0.05 }}
                      >
                        {movie.description}
                      </motion.li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}

            {!!cast.length && (
              <div className={s.cast}>
                <div className={s.castTitle}>В главных ролях</div>
                <div className={s.castList}>
                  {cast.map((actor) => (
                    <div key={actor.id} className={s.actor}>
                      {actor.photo && actor.photo.trim() !== '' && (
                        <img src={actor.photo} alt={actor.name || 'Актёр'} />
                      )}
                      <span>{actor.name || 'Неизвестно'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={s.footer}>
              {!!movie.facts?.length && (
                <div className={s.factsWrapper}>
                  <button
                    className={s.factsToggle}
                    onClick={() => setFactsOpen(!factsOpen)}
                    type="button"
                  >
                    <span>Интересные факты ({movie.facts.length})</span>
                    <motion.span
                      animate={{ rotate: factsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {factsOpen && (
                      <motion.ul
                        className={s.factsList}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        {movie.facts.map((fact, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            {fact.value}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              )}
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
                      onClick={handleWatchedClick}
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
      </>
    );
  },
);
