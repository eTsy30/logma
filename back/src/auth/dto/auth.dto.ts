import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    description: 'JWT access token для авторизации запросов',
    example: 'accessTokenExample.jwt.signature',
  })
  accessToken: string;
}
