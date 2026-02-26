import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { KinopoiskController } from './kinopoisk.controller';
import { KinopoiskService } from './kinopoisk.service';
import { MovieOfTheDayCron } from './movie-of-day.cache';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()], // <-- добавлен ScheduleModule
  controllers: [KinopoiskController],
  providers: [KinopoiskService, MovieOfTheDayCron], // <-- добавлен крон
  exports: [KinopoiskService],
})
export class KinopoiskModule {
  constructor() {
    console.log('✅ KinopoiskModule loaded!');
  }
}
