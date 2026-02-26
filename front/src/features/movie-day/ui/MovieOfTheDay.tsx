import {
  KinopoiskMovie,
  useGetMovieOfTheDayQuery,
} from 'redux/search/kinopoiskApi';
import { DayCard } from 'shared/ui/DayCard/DayCard';
import { RandomMovieButton } from 'shared/ui/RandomMovieButton/RandomMovieButton';
import s from './MovieOfTheDay.module.scss';
export const MovieOfTheDay = () => {
  // const { data, isLoading, error } = useGetMovieOfTheDayQuery();

  // if (isLoading) return <div>Загрузка...</div>;
  // if (error) return <div>Ошибка загрузки</div>;
  // if (!data) return null;

  // const { movie, facts, expiresAt } = data.data;
  // const expiresIn = Math.floor(
  //   (new Date(expiresAt).getTime() - Date.now()) / 1000 / 60,
  // );

  const mockMovie: KinopoiskMovie = {
    id: 999001,
    name: 'Охотники в ночи',
    alternativeName: 'Night Hunters',
    enName: 'Hunters in the Night',
    year: 2023,
    description:
      'Группа наёмников отправляется в глухие леса, чтобы выследить опасного серийного убийцу. Но охота быстро превращается в борьбу за выживание.',
    shortDescription:
      'Наёмники охотятся за серийным убийцей в мрачной ночной глуши.',
    rating: {
      kp: 7.8,
      imdb: 8.1,
    },
    movieLength: 112,
    ageRating: 16,
    poster: {
      url: 'https://placehold.co/600x900',
      previewUrl: 'https://placehold.co/300x450',
    },
    genres: [{ name: 'Драма' }, { name: 'Триллер' }, { name: 'Боевик' }],
    countries: [{ name: 'Россия' }, { name: 'США' }],
    persons: [
      {
        id: 1,
        name: 'Иван Петров',
        enName: 'Ivan Petrov',
        photo: 'https://placehold.co/200x300',
        profession: 'Актёр',
        enProfession: 'Actor',
      },
      {
        id: 2,
        name: 'Анна Смирнова',
        enName: 'Anna Smirnova',
        photo: 'https://placehold.co/200x300',
        profession: 'Актриса',
        enProfession: 'Actress',
      },
    ],
    premiere: {
      russia: '2023-10-12',
    },
    facts: [
      {
        value: 'Съёмки проходили в Карелии в условиях реальной ночной тайги.',
        type: 'FACT',
        spoiler: false,
      },
    ],
  };

  return (
    <div className={s.movie}>
      <DayCard movie={mockMovie} />
      {/* <RandomMovieButton /> */}
    </div>
  );
};
