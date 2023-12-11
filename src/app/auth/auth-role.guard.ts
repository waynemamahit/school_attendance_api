import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import cookie from 'cookie';
import { FastifyRequest } from 'fastify';

export const AuthRoleGuard = (...roles: number[]) => {
  @Injectable()
  class AuthRoleGuardMixin implements CanActivate {
    constructor(public jwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
      const request: FastifyRequest = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1];
      if (typeof token === 'undefined') {
        throw new UnauthorizedException();
      }

      try {
        const secret =
          cookie.parse(request.headers.cookie ?? '')['userKey'] ?? '';
        const user: User = await this.jwtService.verifyAsync(token, { secret });

        return roles.includes(user.role_id);
      } catch {
        throw new UnauthorizedException();
      }
    }
  }

  return mixin(AuthRoleGuardMixin);
};
