import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Logma API')
    .setDescription('Logma backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
}
