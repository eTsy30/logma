/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const url =
      process.env.NODE_ENV === 'production'
        ? process.env.NEON_DATABASE_URL
        : process.env.LOCAL_DATABASE_URL;
    console.log('Connecting to DB:', url,process.env.NODE_ENV,process.env.NEON_DATABASE_URL,process.env.LOCAL_DATABASE_URL)
 
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const pool = new Pool({
      connectionString: url,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
