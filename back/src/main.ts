import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  // Render требует слушать порт из env и 0.0.0.0
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
