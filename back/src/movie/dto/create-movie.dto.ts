import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import type { MovieStatus } from '../entities/movie.entity';

export class CreateMovieDto {
  @IsNumber()
  kinopoiskId: number;

  @IsString()
  title: string;

  @IsNumber()
  year: number;

  @IsString()
  genre: string;

  @IsString()
  posterUrl: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  userRating?: number;

  @IsOptional()
  @IsEnum(['watched', 'want_to_watch'])
  status?: MovieStatus;

  @IsOptional()
  @IsBoolean()
  wouldRewatch?: boolean;

  @IsOptional()
  @IsString()
  userComment?: string;

  @IsOptional()
  @IsString()
  watchDate?: string;
}
