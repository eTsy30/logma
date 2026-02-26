import type { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerConfig } from '../config/swagger.config';

export function setupSwagger(app: INestApplication) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  const document = SwaggerModule.createDocument(app, getSwaggerConfig());
  SwaggerModule.setup('docs', app, document);
}
