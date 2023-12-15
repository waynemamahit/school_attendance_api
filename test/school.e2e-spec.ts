import { faker } from '@faker-js/faker';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { School } from '@prisma/client';
import request from 'supertest';
import { appModuleMeta } from '../src/app/app.module';
import { initPlugin } from '../src/init';
import { loginPayload, registerPayload } from './utils/auth.e2e';

describe('Class Features', () => {
  let app: NestFastifyApplication;
  let token = '';
  let csrf_key = '';
  const schoolPayload = {
    name: faker.location.city(),
    address: faker.location.streetAddress(),
  };
  let newItem: School;
  let userKey = '';
  let userToken = 'Bearer ';

  beforeAll(async () => {
    app = (
      await Test.createTestingModule(appModuleMeta).compile()
    ).createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await initPlugin(app);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(() => app.close());

  it('should get csrf token', async () => {
    const response = await request(app.getHttpServer()).get('/csrf');
    if (response.statusCode === 200) {
      token = response.text;
      csrf_key =
        response.headers['set-cookie']
          ?.find((cookieStr: string) => cookieStr.includes('csrf_key'))
          ?.split(';')[0] ?? '';
    }

    return expect(response.status).toBe(200);
  });

  it('should login as super admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'suadmin',
        password: 'password12345',
      })
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key);

    if (response.statusCode === 200) {
      userKey =
        response.headers['set-cookie']
          ?.find((cookieStr: string) => cookieStr.includes('userKey'))
          ?.split(';')[0] ?? '';
      userToken += response.body.data.token;
    }

    return expect(response.statusCode).toBe(200);
  });

  it('should get all school', async () => {
    const response = await request(app.getHttpServer())
      .get('/school')
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    const isSuccess = response.statusCode === 200;
    if (isSuccess) {
      const data = response.body.data;
      newItem = data[Math.floor(Math.random() * data.length)];
    }

    return expect(response.statusCode).toBe(200);
  });

  it('should select school', async () => {
    const response = await request(app.getHttpServer())
      .get('/school/' + newItem.id)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(201);
  });

  it('should not update school without payload', async () => {
    const response = await request(app.getHttpServer())
      .put('/school/' + newItem.id)
      .send({})
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(400);
  });

  it('should update school', async () => {
    const response = await request(app.getHttpServer())
      .put('/school/' + newItem.id)
      .send(schoolPayload)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(201);
  });

  it('should register', async () => {
    const response = await request(app.getHttpServer())
      .put('/auth/register')
      .send(registerPayload)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key);

    return expect(response.statusCode).toBe(201);
  });

  it('should login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginPayload)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key);

    if (response.statusCode === 200) {
      userKey =
        response.headers['set-cookie']
          ?.find((cookieStr: string) => cookieStr.includes('userKey'))
          ?.split(';')[0] ?? '';
      userToken += response.body.data.token;
    }

    return expect(response.statusCode).toBe(200);
  });

  it('should not update school with invalid ID', async () => {
    const response = await request(app.getHttpServer())
      .put('/school/' + newItem.id)
      .send({})
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(403);
  });

  it('should not select school without super admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/school/' + newItem.id)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(403);
  });
});
