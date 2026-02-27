import { useGetMovieOfTheDayQuery } from 'redux/search/kinopoiskApi';
import { MovieCardContainer } from 'shared/ui/MovieCardContainer/MovieCardContainer';

export const MovieOfTheDay = () => {
  const { data } = useGetMovieOfTheDayQuery();
  const movie = data?.data?.movie ?? null;

  return <MovieCardContainer movie={movie} />;
};
