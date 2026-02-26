import { MoviesTabs } from './ movies';
import { BooksTabs } from './books';
import { ClapperboardIcon, BookOpen } from 'lucide-react';
export const MAIN_TABS = [
  {
    id: 'movies',
    label: 'Кино',
    icon: <ClapperboardIcon />,
    content: <MoviesTabs />,
  },
  {
    id: 'books',
    label: 'Книги',
    icon: <BookOpen />,
    content: <BooksTabs />,
  },
];
