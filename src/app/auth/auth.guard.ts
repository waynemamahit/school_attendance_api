import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
} from '@nestjs/common';
import cookie from 'cookie';
import { FastifyRequest } from 'fastify';
import { AuthRequest } from '../../interfaces/auth.interface';
import { AuthService } from './auth.service';

export const AuthGuard = (isMaster: boolean = false) => {
  @Injectable()
  class AuthGuardMixin implements CanActivate {
    constructor(public auth: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: FastifyRequest & AuthRequest = context
        .switchToHttp()
        .getRequest();

      try {
        const secret =
          cookie.parse(request.headers.cookie ?? '')['userKey'] ?? '';
        request['auth'] = {
          secret,
          user: await this.auth.getUserToken(
            request.headers.authorization?.split(' ')[1],
            secret,
          ),
        };

        return !(isMaster && request.auth.user.role_id !== 1);
      } catch {
        return false;
      }
    }
  }

  return mixin(AuthGuardMixin);
};
