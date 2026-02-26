import React, { memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { formatRating, getAgeBadge, formatDate, truncate } from './utils';
import s from './DayCard.module.scss';
import { KinopoiskMovie } from 'redux/search/kinopoiskApi';

interface Props {
  movie: KinopoiskMovie;
}

export const DayCard: React.FC<Props> = memo(({ movie }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const title =
    movie.name || movie.alternativeName || movie.enName || 'Без названия';

  const subtitle = useMemo(() => {
    if (movie.alternativeName && movie.name !== movie.alternativeName) {
      return `${movie.alternativeName} • ${movie.year ?? ''}`;
    }
    return movie.enName ? `${movie.enName} • ${movie.year ?? ''}` : '';
  }, [movie]);

  const cast = useMemo(
    () =>
      movie.persons
        ?.filter(
          (p) =>
            p.profession?.toLowerCase() === 'актер' ||
            p.profession?.toLowerCase() === 'актриса' ||
            p.profession?.toLowerCase() === 'actress' ||
            p.enProfession?.toLowerCase() === 'actor',
        )
        ?.slice(0, 5) ?? [],
    [movie.persons],
  );

  return (
    <motion.article
      className={s.card}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={s.posterWrapper}>
        {!imgLoaded && <div className={s.skeleton} />}

        {movie.poster?.url && (
          <img
            className={`${s.poster} ${imgLoaded ? s.loaded : ''}`}
            src={movie.poster.url}
            alt={title}
            onLoad={() => setImgLoaded(true)}
          />
        )}

        <div className={s.age}>{getAgeBadge(movie.ageRating)}</div>

        <div className={s.rating}>
          <span className={s.kp}>{formatRating(movie.rating?.kp)}</span>
          {movie.rating?.imdb && (
            <span className={s.imdb}>
              IMDb {formatRating(movie.rating.imdb)}
            </span>
          )}
        </div>
      </div>

      <div className={s.content}>
        <header>
          <h1 className={s.title}>{title}</h1>
          {subtitle && <div className={s.subtitle}>{subtitle}</div>}
        </header>

        <div className={s.meta}>
          {movie.movieLength && <span>{movie.movieLength} мин</span>}
          {movie.countries?.length > 0 && (
            <span>{movie.countries.map((c) => c.name).join(', ')}</span>
          )}
        </div>

        <div className={s.tags}>
          {movie.genres?.map((g, i) => (
            <span key={i} className={s.tag}>
              {g.name}
            </span>
          ))}
        </div>

        <p className={s.description}>{truncate(movie.description, 200)}</p>

        {cast.length > 0 && (
          <div className={s.cast}>
            <div className={s.castTitle}>В главных ролях</div>
            <div className={s.castList}>
              {cast.map((actor) => (
                <div key={actor.id} className={s.actor}>
                  <img src={actor.photo || ''} alt={actor.name || 'Актёр'} />
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
          {movie.facts?.length ? (
            <span>Фактов: {movie.facts.length}</span>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
});
