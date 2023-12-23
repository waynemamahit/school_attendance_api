import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';

export class BaseE2E {
  protected req?: request.SuperTest<request.Test>;

  constructor(app: NestFastifyApplication) {
    this.req = request(app.getHttpServer());
  }
}
