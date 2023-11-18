import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import cookie from 'cookie';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CsrfService } from '../services/csrf.service';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  constructor(private service: CsrfService) {}

  async use(req: FastifyRequest, _res: FastifyReply, next: () => void) {
    const token = req.headers['x-csrf-token'];
    const key = cookie.parse(req.headers.cookie)['csrf_key'];
    const userToken = await this.service.cache.get(req.ip ?? '');
    for (const validator of [
      {
        rule: typeof token === 'undefined' || typeof key === 'undefined',
        message: 'Token or key not exists!',
      },
      {
        rule: typeof userToken === 'undefined',
        message: 'Token has expired!',
      },
      {
        rule: userToken !== token,
        message: 'Invalid user token!',
      },
      {
        rule: !this.service.tokens.verify(key, token as string),
        message: 'Token invalid!',
      },
    ]) {
      if (validator.rule) {
        throw new BadRequestException(validator.message);
      }
    }
    next();
  }
}
