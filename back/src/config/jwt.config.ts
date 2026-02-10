import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

export async function getJwtConfig(
  configService: ConfigService,
): Promise<JwtModuleOptions> {
  const secret = await Promise.resolve(
    configService.getOrThrow<string>('JWT_SECRET'),
  );
  return {
    secret,
    signOptions: {
      algorithm: 'HS256',
      expiresIn: '2h',
    },
    verifyOptions: {
      algorithms: ['HS256'],
      ignoreExpiration: false,
    },
  };
}
