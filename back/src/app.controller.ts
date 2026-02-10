/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prismas/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('/health-db')
  async checkDb() {
    try {
      // Попробуем найти хоть одного пользователя в таблице User
      const user = await this.prisma.user.findFirst();
      return { status: 'ok', user };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return { status: 'error', message: error?.message };
    }
  }
}
