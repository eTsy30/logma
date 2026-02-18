import FilmIcon from 'public/icons/cinema.svg';
import BookIcon from 'public/icons/book.svg';
import { MoviesTabs } from './ movies';
import { BooksTabs } from './books';

export const MAIN_TABS = [
  {
    id: 'movies',
    label: 'Кино',
    icon: <FilmIcon />,
    content: <MoviesTabs />,
  },
  {
    id: 'books',
    label: 'Книги',
    icon: <BookIcon />,
    content: <BooksTabs />,
  },
];
