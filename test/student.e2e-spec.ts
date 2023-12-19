import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { Student, User } from '@prisma/client';
import request from 'supertest';
import { appModuleMeta } from '../src/app/app.module';
import { initPlugin } from '../src/init';
import { loginPayload, registerPayload } from './mocks/auth.e2e-mock';
import { studentPayload } from './mocks/student.e2e-mock';
import { classPayload } from './mocks/class.e2e-mock';
import { teacherPayload } from './mocks/teacher.e2e-mock';

describe('Student Features', () => {
  let app: NestFastifyApplication;
  let token = '';
  let csrf_key = '';
  let newStudent: Student & {
    user: User;
  };
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
        response
          .get('Set-Cookie')
          .find((cookieStr: string) => cookieStr.includes('csrf_key'))
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
        response
          .get('Set-Cookie')
          .find((cookieStr: string) => cookieStr.includes('userKey'))
          ?.split(';')[0] ?? '';
      userToken += response.body.data.token;
    }

    return expect(response.statusCode).toBe(200);
  });

  it('should create new teacher', async () => {
    const response = await request(app.getHttpServer())
      .post('/teacher')
      .send(teacherPayload)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    if (response.statusCode === 201) {
      classPayload.teacher_id = response.body.data.id;
    }

    return expect(response.statusCode).toBe(201);
  });

  it('should create new class', async () => {
    const response = await request(app.getHttpServer())
      .post('/class')
      .send(classPayload)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    if (response.statusCode === 201) {
      studentPayload.class_id = response.body.data.id;
    }

    return expect(response.statusCode).toBe(201);
  });

  it('should get all student', async () => {
    const response = await request(app.getHttpServer())
      .get('/student')
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(200);
  });

  it('should not create new student without payload', async () => {
    const response = await request(app.getHttpServer())
      .post('/student')
      .send({})
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(400);
  });

  it('should create new student', async () => {
    const response = await request(app.getHttpServer())
      .post('/student')
      .send(studentPayload)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    if (response.statusCode === 201) {
      newStudent = response.body.data;
    }

    return expect(response.statusCode).toBe(201);
  });

  it('should get student', async () => {
    const response = await request(app.getHttpServer())
      .get('/student/' + newStudent.id)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    if (response.statusCode === 200) {
      newStudent = response.body.data;
    }

    return expect(response.statusCode).toBe(200);
  });

  it('should not update student without payload', async () => {
    const response = await request(app.getHttpServer())
      .put('/student/' + newStudent.id)
      .send({})
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(400);
  });

  it('should update student', async () => {
    const response = await request(app.getHttpServer())
      .put('/student/' + newStudent.id)
      .send(studentPayload)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(201);
  });

  it('should delete student', async () => {
    const response = await request(app.getHttpServer())
      .delete('/student/' + newStudent.id)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(200);
  });
});
