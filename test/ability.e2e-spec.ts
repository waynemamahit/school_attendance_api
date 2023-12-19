import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { RoleAbility } from '@prisma/client';
import { CreateAbilityDto } from 'src/shared/pipes/zod/ability.validation';
import request from 'supertest';
import { appModuleMeta } from '../src/app/app.module';
import { initPlugin } from '../src/init';
import { loginPayload, registerPayload } from './mocks/auth.e2e-mock';

describe('Ability Features', () => {
  let app: NestFastifyApplication;
  let token = '';
  let csrf_key = '';
  let userKey = '';
  let userToken = 'Bearer ';
  let newRoleAbility: RoleAbility;
  const abilityPayload: CreateAbilityDto = {};

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

  it('should login', async () => {
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
        response
          .get('Set-Cookie')
          .find((cookieStr: string) => cookieStr.includes('userKey'))
          ?.split(';')[0] ?? '';
      userToken += response.body.data.token;
    }

    return expect(response.statusCode).toBe(200);
  });

  it('should get all ability', async () => {
    const response = await request(app.getHttpServer())
      .get('/ability')
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    const isSuccess = response.statusCode === 200;
    if (isSuccess) {
      const data = response.body.data;
      abilityPayload.ability_id =
        data[Math.floor(Math.random() * data.length)].id;
    }

    return expect(isSuccess).toBe(true);
  });

  it('should get all roles', async () => {
    const response = await request(app.getHttpServer())
      .get('/role')
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    const isSuccess = response.statusCode === 200;
    if (isSuccess) {
      const data = response.body.data;
      abilityPayload.role_id = data[Math.floor(Math.random() * data.length)].id;
    }

    return expect(response.statusCode).toBe(200);
  });

  it('should get all ability on roles', async () => {
    const response = await request(app.getHttpServer())
      .get('/ability/role')
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(200);
  });

  it('should not create new ability without payload', async () => {
    const response = await request(app.getHttpServer())
      .post('/ability/role')
      .send({})
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(400);
  });

  it('should create new ability', async () => {
    const response = await request(app.getHttpServer())
      .post('/ability/role')
      .send({
        role_id: 1,
        ability_id: 1,
      })
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    const isSuccess = response.statusCode === 201;
    if (isSuccess) {
      newRoleAbility = response.body.data;
    }

    return expect(isSuccess).toBe(true);
  });

  it('should delete ability', async () => {
    const response = await request(app.getHttpServer())
      .delete('/ability/role/' + newRoleAbility.id)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(200);
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

  it('should not delete ability other than super admin', async () => {
    const response = await request(app.getHttpServer())
      .delete('/ability/role/' + newRoleAbility.id)
      .set('X-CSRF-TOKEN', token)
      .set('Cookie', csrf_key + ';' + userKey + ';')
      .set('Authorization', userToken);

    return expect(response.statusCode).toBe(403);
  });
});
