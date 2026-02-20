export type MovieStatus = 'watched' | 'want_to_watch';

export class UserMovie {
  id: string;
  kinopoiskId: number;
  title: string;
  year: number;
  genre: string;
  posterUrl: string;
  userRating: number;
  status: MovieStatus;
  wouldRewatch: boolean;
  userComment?: string;
  watchDate?: string;
  userId: string;
  createdAt: Date;
}
