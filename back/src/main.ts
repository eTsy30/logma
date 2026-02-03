import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless, { Handler } from 'serverless-http';

const expressApp = express();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors({ origin: '*', credentials: true });
  await app.init();

  // Локальный запуск
  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Server running locally on http://localhost:${port}`);
  }
}

bootstrap();

// Для Serverless на Vercel
export const handler: Handler = serverless(expressApp);
