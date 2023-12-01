import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { initPlugin } from '../src/init';
import { appModuleMeta } from '../src/app/app.module';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;
  let token = '';
  let csrf_key = '';

  beforeAll(async () => {
    app = (
      await Test.createTestingModule(appModuleMeta).compile()
    ).createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await initPlugin(app);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(() => app.close());

  it('should not login without csrf token and key', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@mail.com',
        password: '123456',
      });

    return expect(response.statusCode).toBe(400);
  });

  it('should not login without payload', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({})
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', 'csrf_key=' + csrf_key);

    return expect(response.statusCode).toBe(400);
  });

  it('/csrf (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/csrf');
    if (response.statusCode === 200) {
      token = response.text;
      csrf_key =
        response.headers['set-cookie']
          .find((cookieStr: string) => cookieStr.includes('csrf_key'))
          ?.split('=')[1]
          ?.split(';')[0] ?? '';
    }

    return expect(response.status).toBe(200);
  });

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@mail.com',
        password: '123456',
      })
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', 'csrf_key=' + csrf_key);

    return expect(response.statusCode).toBe(201);
  });
});
