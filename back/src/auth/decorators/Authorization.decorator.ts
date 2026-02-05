import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuards } from '../guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
// для приватных route
export function Authorization() {
  return applyDecorators(UseGuards(JwtGuards), ApiBearerAuth());
}
