import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponse } from './dto/auth.dto';
import { Authorization } from './decorators/Authorization.decorator';
import { Authorized } from './decorators/authorized.decorator';
import type { User } from '@prisma/client';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiConflictResponse({
    description: 'Пользователь с такой почтой уже существует',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Регистрация пользователя',
    description:
      'Создаёт нового пользователя и устанавливает refresh-token в httpOnly cookie',
  })
  @ApiCreatedResponse({
    description: 'Пользователь успешно зарегистрирован',
    type: AuthResponse,
    example: {
      id: 'uuid',
      name: 'Максим',
      email: 'maks@mail.com',
    },
  })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации входных данных',
  })
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterRequestDto,
  ) {
    return this.authService.register(res, dto);
  }

  @Post('login')
  @ApiOkResponse({ type: AuthResponse })
  @ApiConflictResponse({
    description: 'Пользователь с такой почтой уже существует',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Авторизация пользователя',
    description:
      'Проверяет email и пароль, возвращает access-token и устанавливает refresh-token в cookie',
  })
  @ApiUnauthorizedResponse({
    description: 'Неверный email или пароль',
  })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    return this.authService.login(res, dto);
  }

  @Post('refresh')
  @ApiOkResponse({ type: AuthResponse })
  @ApiUnauthorizedResponse({
    description: 'Недействительный refresh token',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Обновление access-token',
    description:
      'Использует refresh-token из httpOnly cookie и возвращает новый access-token',
  })
  @ApiOkResponse({
    description: 'Access-token успешно обновлён',
    example: {
      accessToken: 'newAccessToken...',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh-token отсутствует или недействителен',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Выход пользователя',
    description:
      'Удаляет refresh-token из cookie и завершает пользовательскую сессию',
  })
  @ApiOkResponse({
    description: 'Пользователь успешно вышел из системы',
  })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(res, req);
  }
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Запрос на восстановление пароля',
    description: 'Отправляет email со ссылкой для сброса пароля (15 мин)',
  })
  @ApiOkResponse({
    description: 'Если email существует, письмо отправлено',
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Сброс пароля',
    description: 'Принимает токен и новый пароль, инвалидирует все сессии',
  })
  @ApiOkResponse({
    description: 'Пароль успешно изменён',
  })
  @ApiBadRequestResponse({
    description: 'Токен просрочен или недействителен',
  })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.resetPassword(dto, res);
  }

  @Authorization()
  @Get('@me')
  @HttpCode(HttpStatus.OK)
  me(@Authorized() user: User) {
    return user;
  }
}
