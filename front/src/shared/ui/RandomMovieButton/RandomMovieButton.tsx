import { useLazyGetRandomMovieQuery } from 'redux/search/kinopoiskApi';

export const RandomMovieButton = () => {
  const [getRandomMovie, { data, isLoading }] = useLazyGetRandomMovieQuery();

  const handleClick = () => {
    getRandomMovie();
  };
  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Загрузка...' : '🎲 Случайный фильм'}
      </button>

      {data && (
        <div>
          <h3>{data.name || data.alternativeName}</h3>
          <img src={data.poster?.url} alt={data.name || 'Постер'} />
          <p>Рейтинг: {data.rating?.kp}</p>
        </div>
      )}
    </div>
  );
};
