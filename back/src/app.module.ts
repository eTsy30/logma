import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <- вот это нужно добавить
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prismas/prisma.module';
import { AuthModule } from './auth/auth.module';
import { KinopoiskModule } from './kinopoisk/kinopoisk.module';
import { MoviesModule } from './movie/movie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // env доступны везде
    }),
    PrismaModule,
    AuthModule,
    KinopoiskModule,
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
