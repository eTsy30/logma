import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Полный интерфейс согласно документации
export interface KinopoiskMovie {
  id: number;
  name?: string;
  alternativeName?: string;
  enName?: string;
  year?: number;
  description?: string;
  shortDescription?: string;
  rating?: {
    kp?: number;
    imdb?: number;
  };
  movieLength?: number;
  ageRating?: number;
  poster?: {
    url?: string;
    previewUrl?: string;
  };
  genres: { name: string }[];
  countries: { name: string }[];
  persons?: {
    id: number;
    name?: string;
    enName?: string;
    photo?: string;
    profession?: string;
    enProfession?: string;
  }[];
  premiere?: {
    russia?: string;
  };
  facts?: {
    value: string;
    type?: string;
    spoiler?: boolean;
  }[];
}

export interface KinopoiskSearchResponse {
  docs: KinopoiskMovie[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface MovieFact {
  value: string;
  type: 'FACT' | 'BLOOPER';
  spoiler: boolean;
}

export interface MovieOfTheDay {
  movie: KinopoiskMovie;
  cachedAt: string;
  expiresAt: string;
}

@Injectable()
export class KinopoiskService {
  private readonly logger = new Logger(KinopoiskService.name);
  private readonly baseUrl = 'https://api.poiskkino.dev/v1.4'; // Убран пробел!
  private movieOfTheDayCache: {
    data: MovieOfTheDay | null;
    date: string;
  } = { data: null, date: '' };

  constructor(private readonly configService: ConfigService) {}

  private getHeaders(): Record<string, string> {
    const apiKey = this.configService.get<string>('KINOPOISK_API_KEY');
    if (!apiKey) {
      throw new HttpException(
        'Kinopoisk API key not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    };
  }

  async searchMovies(
    query: string,
    limit: number = 10,
  ): Promise<KinopoiskSearchResponse> {
    try {
      const params = new URLSearchParams({ query, limit: limit.toString() });
      const response = await fetch(`${this.baseUrl}/movie/search?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new HttpException(
          'Failed to fetch movies from Kinopoisk',
          response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.json() as Promise<KinopoiskSearchResponse>;
    } catch (error) {
      this.logger.error('Kinopoisk API error:', error);
      throw new HttpException(
        'Failed to fetch movies from Kinopoisk',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMovieById(id: number): Promise<KinopoiskMovie> {
    try {
      const response = await fetch(`${this.baseUrl}/movie/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new HttpException(
          'Failed to fetch movie details',
          response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.json() as Promise<KinopoiskMovie>;
    } catch (error) {
      this.logger.error('Kinopoisk API error:', error);
      throw new HttpException(
        'Failed to fetch movie details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * ПОЛУЧИТЬ РАНДОМНЫЙ ТАЙТЛ — используем /movie/random
   */
  async getRandomMovie(): Promise<KinopoiskMovie> {
    const params = new URLSearchParams({
      'rating.kp': '7-10', // Только хорошие фильмы
      notNullFields: 'name', // Только с названием
      type: 'movie', // Только фильмы (не сериалы)
    });

    const response = await fetch(`${this.baseUrl}/movie/random?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new HttpException('Failed to fetch random movie', response.status);
    }

    const movie = (await response.json()) as KinopoiskMovie;

    this.logger.debug('Random movie:', {
      id: movie.id,
      name: movie.name,
      alternativeName: movie.alternativeName,
      rating: movie.rating?.kp,
    });

    return movie;
  }

  private getMovieTitle(movie: KinopoiskMovie): string {
    return (
      movie.name ||
      movie.alternativeName ||
      movie.enName ||
      `Фильм #${movie.id}`
    );
  }

  async getMovieOfTheDay(): Promise<MovieOfTheDay> {
    const today = new Date().toISOString().split('T')[0];

    if (
      this.movieOfTheDayCache.date === today &&
      this.movieOfTheDayCache.data
    ) {
      return this.movieOfTheDayCache.data;
    }

    return this.generateMovieOfTheDay();
  }

  async generateMovieOfTheDay(): Promise<MovieOfTheDay> {
    const today = new Date().toISOString().split('T')[0];

    this.logger.log('Generating new movie of the day...');

    const movie = await this.getRandomMovie();

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const movieOfTheDay: MovieOfTheDay = {
      movie,

      cachedAt: now.toISOString(),
      expiresAt: tomorrow.toISOString(),
    };

    this.movieOfTheDayCache = {
      data: movieOfTheDay,
      date: today,
    };

    const title = this.getMovieTitle(movie);
    this.logger.log(`Movie of the day: ${title} (${movie.id})`);
    this.logger.log(movieOfTheDay);
    return movieOfTheDay;
  }

  async forceUpdateMovieOfTheDay(): Promise<MovieOfTheDay> {
    this.movieOfTheDayCache = { data: null, date: '' };
    return this.generateMovieOfTheDay();
  }
}
