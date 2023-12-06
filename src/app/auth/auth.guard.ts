import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import cookie from 'cookie';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (typeof token === 'undefined') {
      throw new UnauthorizedException();
    }
    try {
      const secret =
        cookie.parse(request.headers.cookie ?? '')['userKey'] ?? '';
      request['auth'] = {
        secret,
        user: await this.jwtService.verifyAsync(token, { secret }),
      };
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}