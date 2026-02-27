import { useLazyGetRandomMovieQuery } from 'redux/search/kinopoiskApi';
import { MovieCardContainer } from '../MovieCardContainer/MovieCardContainer';
import { Button } from '../Button';
import s from './RandomMovieButton.module.scss';
export const RandomMovieButton = () => {
  const [getRandomMovie, { data, isLoading }] = useLazyGetRandomMovieQuery();

  return (
    <div className={s.container}>
      <Button
        size="md"
        theme="primary"
        onClick={() => getRandomMovie()}
        disabled={isLoading}
        loading={isLoading}
      >
        Найти фильм
      </Button>

      <MovieCardContainer movie={data?.data ?? null} />
    </div>
  );
};
