import request from 'supertest';
import { BaseE2E } from './base.e2e';

export class CsrfE2E extends BaseE2E {
  token = '';
  key = '';

  async getTokenKey() {
    const response = await this.req.get('/csrf');
    if (response.statusCode === 200) {
      this.token = response.text;
      this.key =
        response
          .get('Set-Cookie')
          .find((cookieStr: string) => cookieStr.includes('csrf_key'))
          ?.split(';')[0] ?? '';
    }

    return response;
  }

  setHeader(req: request.Test, isCsrf = false, cookies: string[] = []) {
    if (isCsrf)
      req.set('X-CSRF-TOKEN', this.token).set('Cookie', [...cookies, this.key]);
    return req;
  }
}
