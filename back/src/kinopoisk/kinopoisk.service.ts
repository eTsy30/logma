import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface KinopoiskMovie {
  id: number;
  name: string;
  alternativeName?: string;
  year: number;
  description?: string;
  shortDescription?: string;
  genres: { name: string }[];
  countries: { name: string }[];
  poster?: {
    url: string;
    previewUrl: string;
  };
  rating?: {
    kp: number;
    imdb: number;
  };
  movieLength?: number;
  type: string;
}

export interface KinopoiskSearchResponse {
  docs: KinopoiskMovie[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

@Injectable()
export class KinopoiskService {
  private readonly baseUrl = 'https://api.poiskkino.dev/v1.4';

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
      console.error('Kinopoisk API error:', error);
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
      console.error('Kinopoisk API error:', error);
      throw new HttpException(
        'Failed to fetch movie details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
