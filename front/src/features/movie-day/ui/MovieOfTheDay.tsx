import Loading from '@/app/loading';
import { useGetMovieOfTheDayQuery } from 'redux/search/kinopoiskApi';
import { MovieCardContainer } from 'shared/ui/MovieCardContainer/MovieCardContainer';

export const MovieOfTheDay = () => {
  const { data, isLoading } = useGetMovieOfTheDayQuery();
  const movie = data?.data?.movie ?? null;
  if (isLoading) return <Loading></Loading>;
  return <MovieCardContainer movie={movie} />;
};
