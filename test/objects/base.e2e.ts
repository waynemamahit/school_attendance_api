import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import TestAgent from 'supertest/lib/agent';

export class BaseE2E {
  protected req?: TestAgent<request.Test>;

  constructor(app: NestFastifyApplication) {
    this.req = request(app.getHttpServer());
  }
}
