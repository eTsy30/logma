import { KinopoiskMovie } from 'redux/search/kinopoiskApi';
import { Movie } from 'shared/ui/MovieCard/MovieCard';

export function transformKinopoiskToMovie(kpMovie: KinopoiskMovie): Movie {
  // Конвертируем рейтинг КиноПоиска (0-10) в наш (1-5)
  const rawRating = kpMovie.rating?.kp || 0;
  const normalizedRating =
    rawRating > 0 ? Math.max(1, Math.min(5, Math.round(rawRating / 2))) : 0;

  return {
    id: String(kpMovie.id),
    title: kpMovie.name || kpMovie.alternativeName || 'Без названия',
    year: kpMovie.year || 0,
    genre: kpMovie.genres?.[0]?.name || 'Неизвестно',
    posterUrl: kpMovie.poster?.url || '/placeholder-movie.jpg',
    rating: normalizedRating,
    wouldRewatch: false,
    watchDate: new Date().toISOString().split('T')[0]!,
    note: kpMovie.shortDescription || kpMovie.description || '',
  };
}
