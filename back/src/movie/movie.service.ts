import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prismas/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieStatus, UserMovie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateMovieDto): Promise<UserMovie> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const existing = await this.prisma.userMovie.findFirst({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where: { userId, kinopoiskId: dto.kinopoiskId },
    });

    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const updated = await this.prisma.userMovie.update({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        where: { id: existing.id },
        data: {
          userRating: dto.userRating,
          status: dto.status,
          wouldRewatch: dto.wouldRewatch,
          userComment: dto.userComment,
          watchDate: dto.watchDate,
        },
      });
      return updated as unknown as UserMovie;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const created = await this.prisma.userMovie.create({
      data: {
        kinopoiskId: dto.kinopoiskId,
        title: dto.title,
        year: dto.year,
        genre: dto.genre,
        posterUrl: dto.posterUrl,
        userRating: dto.userRating ?? 0,
        status: dto.status ?? 'want_to_watch',
        wouldRewatch: dto.wouldRewatch ?? false,
        userComment: dto.userComment ?? null,
        watchDate: dto.watchDate ?? null,
        userId,
      },
    });
    return created as unknown as UserMovie;
  }

  async findAllByUser(userId: string): Promise<UserMovie[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const movies = await this.prisma.userMovie.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return movies as unknown as UserMovie[];
  }

  async findOne(id: string, userId: string): Promise<UserMovie> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const movie = await this.prisma.userMovie.findFirst({
      where: { id, userId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie as unknown as UserMovie;
  }

  async update(
    id: string,
    userId: string,
    dto: Partial<CreateMovieDto>,
  ): Promise<UserMovie> {
    await this.findOne(id, userId);

    const updateData: Record<string, unknown> = {};

    if (dto.userRating !== undefined) updateData.userRating = dto.userRating;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.wouldRewatch !== undefined)
      updateData.wouldRewatch = dto.wouldRewatch;
    if (dto.userComment !== undefined) updateData.userComment = dto.userComment;
    if (dto.watchDate !== undefined) updateData.watchDate = dto.watchDate;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const updated = await this.prisma.userMovie.update({
      where: { id },
      data: updateData,
    });
    return updated as unknown as UserMovie;
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await this.prisma.userMovie.delete({
      where: { id },
    });
  }

  async checkByKinopoiskId(
    kinopoiskId: number,
    userId: string,
  ): Promise<{ exists: boolean; status?: MovieStatus }> {
    const movie = await this.prisma.userMovie.findFirst({
      where: { userId, kinopoiskId },
      select: { status: true },
    });

    if (!movie) return { exists: false };

    return { exists: true, status: movie.status as MovieStatus };
  }
}
