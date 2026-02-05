import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Максим',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя обязательно для заполнения' })
  @MinLength(2, { message: 'Имя должно быть минимум 2 символа' })
  @MaxLength(50, { message: 'Имя не может быть больше 50 символов' })
  name: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'StrongPassword123',
    minLength: 6,
    maxLength: 120,
    format: 'password',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  @MinLength(6, { message: 'Пароль должен быть минимум 6 символов' })
  @MaxLength(120, { message: 'Пароль не может быть больше 120 символов' })
  password: string;

  @ApiProperty({
    description: 'E-mail пользователя',
    example: 'maks@mail.com',
    format: 'email',
    maxLength: 254,
  })
  @IsEmail({}, { message: 'Некорректный формат E-mail' })
  @IsString({ message: 'E-mail должен быть строкой' })
  @IsNotEmpty({ message: 'E-mail обязателен для заполнения' })
  @MaxLength(254, { message: 'E-mail не может быть больше 254 символов' })
  email: string;
}
