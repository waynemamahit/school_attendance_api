import { faker } from '@faker-js/faker';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { Teacher } from '@prisma/client';
import { randomBytes } from 'crypto';
import request from 'supertest';
import { appModuleMeta } from '../src/app/app.module';
import { initPlugin } from '../src/init';
import { loginPayload, registerPayload } from './utils/auth.e2e';

describe('Teacher Features', () => {
  let app: NestFastifyApplication;
  let token = '';
  let csrf_key = '';
  const teacherPayload = {
    name: faker.person.fullName(),
    id_number: randomBytes(12).toString('hex'),
    email: faker.internet.email(),
    username: faker.person.firstName(),
  };
  let newTeacher: Teacher;
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

  it('should get all teacher', async () => {
    const response = await request(app.getHttpServer())
      .get('/teacher')
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(200);
  });

  it('should not create new teacher without payload', async () => {
    const response = await request(app.getHttpServer())
      .post('/teacher')
      .send({})
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(400);
  });

  it('should create new teacher', async () => {
    const response = await request(app.getHttpServer())
      .post('/teacher')
      .send(teacherPayload)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    const isSuccess = response.statusCode === 201;
    if (isSuccess) {
      newTeacher = response.body.data;
    }

    return expect(isSuccess).toBe(true);
  });

  it('should get teacher', async () => {
    const response = await request(app.getHttpServer())
      .get('/teacher/' + newTeacher.id)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(200);
  });

  it('should not update teacher without payload', async () => {
    const response = await request(app.getHttpServer())
      .patch('/teacher/' + newTeacher.id)
      .send({})
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(400);
  });

  it('should update teacher', async () => {
    const response = await request(app.getHttpServer())
      .patch('/teacher/' + newTeacher.id)
      .send(teacherPayload)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(201);
  });

  it('should delete teacher', async () => {
    const response = await request(app.getHttpServer())
      .delete('/teacher/' + newTeacher.id)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(200);
  });
});
