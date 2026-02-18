// src/kinopoisk/kinopoisk.controller.ts
import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import {
  KinopoiskService,
  KinopoiskSearchResponse,
  KinopoiskMovie,
} from './kinopoisk.service'; // ваш guard
import { Authorization } from 'src/auth/decorators/Authorization.decorator';

@Controller('kinopoisk')
@Authorization() // защита авторизацией (опционально)
export class KinopoiskController {
  constructor(private readonly kinopoiskService: KinopoiskService) {}

  @Get('search')
  async search(
    @Query('query') query: string,
    @Query('limit') limit?: string,
  ): Promise<KinopoiskSearchResponse> {
    if (!query || query.length < 2) {
      return { docs: [], total: 0, limit: 10, page: 1, pages: 0 };
    }
    return this.kinopoiskService.searchMovies(
      query,
      parseInt(limit || '10') || 10,
    );
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
    error?: unknown;
  }> {
    try {
      const result = await this.kinopoiskService.searchMovies('начало', 1);
      return {
        status: 'ok',
        apiKey: true,
        testMovie: result.docs[0] || null,
      };
    } catch (error) {
      return {
        status: 'error',
        apiKey: !!process.env.KINOPOISK_API_KEY,
        error,
      };
    }
  }
}
