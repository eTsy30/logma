import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { CreateMovieDto } from './dto/create-movie.dto';
import { Authorization } from '../auth/decorators/Authorization.decorator';
import { MoviesService } from './movie.service';
import { AuthenticatedRequest } from '../auth/interfaces/auth.interfaces';

@Controller('movies')
@Authorization()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(
    @Body() dto: CreateMovieDto,
    @Req() req: Request & AuthenticatedRequest,
  ) {
    return this.moviesService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: Request & AuthenticatedRequest) {
    return this.moviesService.findAllByUser(req.user.id);
  }
  @Get('by-kinopoisk/:kinopoiskId/check')
  checkByKinopoiskId(
    @Param('kinopoiskId', ParseIntPipe) kinopoiskId: number,
    @Req() req: Request & AuthenticatedRequest,
  ) {
    return this.moviesService.checkByKinopoiskId(kinopoiskId, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request & AuthenticatedRequest) {
    return this.moviesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateMovieDto>,
    @Req() req: Request & AuthenticatedRequest,
  ) {
    return this.moviesService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request & AuthenticatedRequest) {
    return this.moviesService.remove(id, req.user.id);
  }
}
