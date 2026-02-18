// src/auth/auth.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prismas/prisma.service';
import { RegisterRequestDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from './interfaces/jwt.interfaces';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { isDev } from 'src/utils/is-dev.util';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly JWT_RESET_TOKEN_TTL = '15m';
  private readonly RESET_TOKEN_SECRET: string;
  private readonly COOKIE_DOMAIN: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {
    this.RESET_TOKEN_SECRET = configService.getOrThrow('JWT_RESET_SECRET');
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  async register(res: Response, dto: RegisterRequestDto) {
    const { name, email, password } = dto;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const existUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existUser) {
      throw new ConflictException('Пользователь с такой почтой уже существует');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: await argon2.hash(password),
      },
    });
    return await this.auth(res, user.id);
  }

  async login(res: Response, dto: LoginDto) {
    const { email, password } = dto;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      throw new NotFoundException('Пользователь не найден');
    }
    return await this.auth(res, user.id);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = (req.cookies as Record<string, string> | undefined)?.[
      'refresh_token'
    ];
    if (!refreshToken) {
      throw new UnauthorizedException('Недействительный refresh-token');
    }
    try {
      const payload: JwtPayload =
        await this.jwtService.verifyAsync(refreshToken);

      // Проверяем наличие токена в базе данных
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const tokenInDb = await this.prismaService.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!tokenInDb) {
        throw new UnauthorizedException('Сессия истекла или недействительна');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
        select: { id: true },
      });
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      // Удаляем старый токен перед созданием нового (ротация)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await this.prismaService.refreshToken.delete({
        where: { token: refreshToken },
      });

      return await this.auth(res, user.id);
    } catch {
      throw new UnauthorizedException('Недействительный refresh-token');
    }
  }

  async logout(res: Response, req: Request) {
    const refreshToken = (req.cookies as Record<string, string> | undefined)?.[
      'refresh_token'
    ];
    if (refreshToken) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await this.prismaService.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }
    this.setCookies(res, '', new Date(0));
    return true;
  }

  async validate(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { message: 'Если email существует, письмо отправлено' };
    }

    const resetToken = this.jwtService.sign(
      { userId: user.id, email: user.email, type: 'password-reset' },
      {
        secret: this.RESET_TOKEN_SECRET,
        expiresIn: this.JWT_RESET_TOKEN_TTL,
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: await argon2.hash(resetToken),
        resetTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    await this.emailService.sendPasswordReset(user.email, resetUrl);

    return { message: 'Если email существует, письмо отправлено' };
  }

  async resetPassword(dto: ResetPasswordDto, res: Response) {
    const { token, newPassword } = dto;

    let payload: { userId: string; email: string; type: string };
    try {
      payload = this.jwtService.verify(token, {
        secret: this.RESET_TOKEN_SECRET,
      });
    } catch {
      throw new BadRequestException('Токен просрочен или недействителен');
    }

    if (payload.type !== 'password-reset') {
      throw new BadRequestException('Неверный тип токена');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.resetTokenHash || !user.resetTokenExpires) {
      throw new BadRequestException('Токен уже использован');
    }

    if (new Date() > user.resetTokenExpires) {
      throw new BadRequestException('Токен просрочен');
    }

    const isValidToken = await argon2.verify(user.resetTokenHash, token);
    if (!isValidToken) {
      throw new BadRequestException('Недействительный токен');
    }

    const hashedPassword = await argon2.hash(newPassword);

    // Используем транзакцию для атомарного обновления пароля и удаления токенов
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await this.prismaService.$transaction([
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.prismaService.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetTokenHash: null,
          resetTokenExpires: null,
        },
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.prismaService.refreshToken.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    this.setCookies(res, '', new Date(0));

    return { message: 'Пароль успешно изменён' };
  }

  private async auth(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateToken(id);

    // Сохраняем refresh-token в базе данных
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    this.setCookies(
      res,
      refreshToken,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    );
    return { accessToken };
  }

  private generateToken(id: string) {
    const payload: JwtPayload = { id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL as any,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL as any,
    });
    return { accessToken, refreshToken };
  }

  private setCookies(res: Response, value: string, expires: Date) {
    res.cookie('refresh_token', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: !isDev(this.configService) ? 'none' : 'lax',
    });
  }
}
