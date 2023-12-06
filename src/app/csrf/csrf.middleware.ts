import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import cookie from 'cookie';
import { CsrfService } from './csrf.service';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  constructor(private service: CsrfService) {}

  async use(req: any, _: any, next: () => void) {
    const token = req.headers['x-csrf-token'];
    const key = cookie.parse(req.headers.cookie ?? '')['csrf_key'];
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
        throw new HttpException(validator.message, 419);
      }
    }
    next();
  }
}
