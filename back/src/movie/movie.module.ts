// src/movie/movie.module.ts
import { Module } from '@nestjs/common';

import { MoviesController } from './movie.controller';
import { MoviesService } from './movie.service';
import { PrismaService } from '../prismas/prisma.service';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, PrismaService],
  exports: [MoviesService],
})
export class MoviesModule {}
