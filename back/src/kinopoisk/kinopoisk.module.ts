import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { KinopoiskController } from './kinopoisk.controller';
import { KinopoiskService } from './kinopoisk.service';

@Module({
  imports: [ConfigModule],
  controllers: [KinopoiskController],
  providers: [KinopoiskService],
  exports: [KinopoiskService],
})
export class KinopoiskModule {
  constructor() {
    console.log('✅ KinopoiskModule loaded!'); // Добавьте это
  }
}
