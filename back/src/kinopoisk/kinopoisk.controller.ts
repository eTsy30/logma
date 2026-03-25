import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  KinopoiskService,
  KinopoiskSearchResponse,
  KinopoiskMovie,
  MovieOfTheDay,
} from './kinopoisk.service';
import { Authorization } from '../auth/decorators/Authorization.decorator';
import { Authorized } from '../auth/decorators/authorized.decorator';
import type { User } from '@prisma/client';

@Controller('kinopoisk')
@Authorization()
export class KinopoiskController {
  constructor(private readonly kinopoiskService: KinopoiskService) {}

  @Get('search')
  async search(
    @Query('query') query: string,
    @Query('limit') limit?: string,
  ): Promise<KinopoiskSearchResponse> {
    const q = query?.trim();
    if (!q || q.length < 2) {
      return { docs: [], total: 0, limit: 10, page: 1, pages: 0 };
    }

    if (q.length > 100) {
      throw new HttpException('Query is too long', HttpStatus.BAD_REQUEST);
    }

    const parsedLimit = Number.parseInt(limit || '10', 10);
    const safeLimit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 50)
      : 10;

    return this.kinopoiskService.searchMovies(q, safeLimit);
  }

  @Get('movie/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<KinopoiskMovie> {
    return this.kinopoiskService.getMovieById(id);
  }

  @Get('test')
  async test(): Promise<{
    status: string;
    apiKey: boolean;
    testMovie?: any;
    error?: string;
  }> {
    try {
      const result = await this.kinopoiskService.searchMovies('начало', 1);
      return {
        status: 'ok',
        apiKey: true,
        testMovie: result.docs[0] || null,
      };
    } catch {
      return {
        status: 'error',
        apiKey: !!process.env.KINOPOISK_API_KEY,
        error: 'Internal error',
      };
    }
  }

  @Get('movie-of-the-day')
  async getMovieOfTheDay(): Promise<{
    success: boolean;
    data: MovieOfTheDay;
    meta: {
      expiresIn: number;
    };
  }> {
    const movieOfTheDay = await this.kinopoiskService.getMovieOfTheDay();

    const expiresAt = new Date(movieOfTheDay.expiresAt).getTime();
    const now = Date.now();
    const expiresIn = Math.max(0, Math.floor((expiresAt - now) / 1000));

    return {
      success: true,
      data: movieOfTheDay,
      meta: { expiresIn },
    };
  }

  @Post('movie-of-the-day/refresh')
  async refreshMovieOfTheDay(
    @Authorized() user: Pick<User, 'id' | 'email' | 'name'>,
  ): Promise<{
    success: boolean;
    data: MovieOfTheDay;
  }> {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new HttpException(
        'Admin configuration is missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!user?.email || user.email !== adminEmail) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const movieOfTheDay =
      await this.kinopoiskService.forceUpdateMovieOfTheDay();

    return {
      success: true,
      data: movieOfTheDay,
    };
  }

  // Новый endpoint для теста рандома
  @Get('random')
  async getRandom(): Promise<{
    success: boolean;
    data: KinopoiskMovie;
  }> {
    const movie = await this.kinopoiskService.getRandomMovie();
    return {
      success: true,
      data: movie,
    };
  }
}
