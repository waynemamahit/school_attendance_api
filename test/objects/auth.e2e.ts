import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { AuthE2EMock } from '../mocks/auth.e2e-mock';
import { BaseE2E } from './base.e2e';
import { CsrfE2E } from './csrf.e2e';

export class AuthE2E extends BaseE2E {
  csrf: CsrfE2E;
  mock = new AuthE2EMock();
  key = '';
  token = '';

  constructor(app: NestFastifyApplication) {
    super(app);
    this.csrf = new CsrfE2E(app);
  }

  getRequest = async (req: request.Test) =>
    await this.csrf.setHeader(req.set('Authorization', this.token), true, [
      this.key,
    ]);

  register = async (data: object = {}, isCsrf = true) =>
    await this.csrf.setHeader(
      this.req.put('/auth/register').send(data),
      isCsrf,
    );

  async login(data: object = {}, isCsrf = true) {
    const response = await this.csrf.setHeader(
      this.req.post('/auth/login').send(data),
      isCsrf,
    );

    if (response.statusCode === 200) {
      this.key =
        response
          .get('Set-Cookie')
          .find((cookieStr: string) => cookieStr.includes('userKey'))
          ?.split(';')[0] ?? '';
      this.token = 'Bearer ' + response.body.data.token;
    }

    return response;
  }
}
