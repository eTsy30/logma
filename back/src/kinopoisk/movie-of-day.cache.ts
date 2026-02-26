import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { KinopoiskService } from './kinopoisk.service';

@Injectable()
export class MovieOfTheDayCron {
  private readonly logger = new Logger(MovieOfTheDayCron.name);

  constructor(private readonly kinopoiskService: KinopoiskService) {}

  @Cron('0 13 * * *') // 13:00 каждый день
  async handleMidnightUpdate(): Promise<void> {
    this.logger.log('🕛 1PM cron started: updating movie of the day');

    try {
      await this.kinopoiskService.generateMovieOfTheDay();
      this.logger.log('✅ Movie of the day updated successfully');
    } catch (error) {
      this.logger.error('❌ Failed to update movie of the day:', error);
    }
  }
  // @Cron('*/30 * * * * *') // каждые 30 секунд
  // async handleMidnightUpdate() {}
}
