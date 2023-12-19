import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { appModuleMeta } from '../src/app/app.module';
import { initPlugin } from '../src/init';
import { loginPayload, registerPayload } from './mocks/auth.e2e-mock';

describe('Authentication and Authorization', () => {
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

  it('should not register without csrf token and key', async () => {
    const response = await request(app.getHttpServer())
      .put('/auth/register')
      .send(registerPayload);

    return expect(response.statusCode).toBe(419);
  });

  it('should not login without csrf token and key', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@mail.com',
        password: '123456',
      });

    return expect(response.statusCode).toBe(419);
  });

  it('should get token CSRF', async () => {
    const response = await request(app.getHttpServer()).get('/csrf');
    if (response.statusCode === 200) {
      token = response.text;
      csrf_key =
        response
          .get('Set-Cookie')
          .find((cookieStr: string) => cookieStr.includes('csrf_key'))
          ?.split('=')[1]
          ?.split(';')[0] ?? '';
    }

    return expect(response.status).toBe(200);
  });

  it('should not register without payload', async () => {
    const response = await request(app.getHttpServer())
      .put('/auth/register')
      .send({})
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', 'csrf_key=' + csrf_key);

    return expect(response.statusCode).toBe(400);
  });

  it('should register', async () => {
    const response = await request(app.getHttpServer())
      .put('/auth/register')
      .send(registerPayload)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', 'csrf_key=' + csrf_key);

    return expect(response.statusCode).toBe(201);
  });

  it('should not login without payload', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({})
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', 'csrf_key=' + csrf_key);

    return expect(response.statusCode).toBe(400);
  });

  it('should login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginPayload)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', 'csrf_key=' + csrf_key);

    return expect(response.statusCode).toBe(200);
  });
});
