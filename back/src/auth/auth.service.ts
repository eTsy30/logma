import {
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

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string | number;
  private readonly JWT_REFRESH_TOKEN_TTL: string | number;

  private readonly COOKIE_DOMAIN: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string | number>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string | number>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
  }
  async register(res: Response, dto: RegisterRequestDto) {
    const { name, email, password } = dto;
    const existUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existUser) {
      throw new ConflictException('Пользователь с такой почной уже существует');
    }
    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: await argon2.hash(password),
      },
    });
    return this.auth(res, user.id);
  }

  async login(res: Response, dto: LoginDto) {
    const { email, password } = dto;
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
    return this.auth(res, user.id);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = (req.cookies as Record<string, string> | undefined)?.[
      'refresh_token'
    ];
    if (!refreshToken) {
      throw new UnauthorizedException('Недействительный refresh-token');
    }
    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);
    if (payload) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
        select: { id: true },
      });
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }
      return this.auth(res, user.id);
    }
  }

  logout(res: Response) {
    this.setCookies(res, '', new Date(0));
    return true;
  }
  async validate(id: string) {
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

  private auth(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateToken(id);
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
      // eslint-disable-next-line
      expiresIn: this.JWT_ACCESS_TOKEN_TTL as any,
    });
    const refreshToken = this.jwtService.sign(payload, {
      // eslint-disable-next-line
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
