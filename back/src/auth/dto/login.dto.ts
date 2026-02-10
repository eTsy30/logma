import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail пользователя, указанный при регистрации',
    example: 'maks@mail.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Некорректный формат E-mail' })
  @IsString({ message: 'E-mail должен быть строкой' })
  @IsNotEmpty({ message: 'E-mail обязателен для заполнения' })
  email: string;

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
}
