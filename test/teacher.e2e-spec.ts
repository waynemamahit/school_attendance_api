import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { TeacherE2E } from './objects/teacher.e2e';
import { initApp } from './utils/app.e2e-util';
import { initAuth } from './utils/auth.e2e-util';

describe('Teacher Features', () => {
  let app: NestFastifyApplication;
  let teacher: TeacherE2E;

  beforeAll(async () => {
    app = await initApp();
    teacher = new TeacherE2E(app);
  });

  afterAll(() => app.close());

  it('should get all teacher', async () => {
    teacher.auth = await initAuth(app);

    const response = await teacher.getTeachers();

    return expect(response.statusCode).toBe(200);
  });

  it('should not create new teacher without payload', async () => {
    const response = await teacher.createTeacher();

    return expect(response.statusCode).toBe(400);
  });

  it('should create new teacher', async () => {
    const response = await teacher.createTeacher(teacher.mock.createDto);

    return expect(response.statusCode).toBe(201);
  });

  it('should get teacher', async () => {
    const response = await teacher.showTeacher(teacher.newTeacher.id);

    return expect(response.statusCode).toBe(200);
  });

  it('should not update teacher without payload', async () => {
    const response = await teacher.updateTeacher(teacher.newTeacher.id);

    return expect(response.statusCode).toBe(400);
  });

  it('should update teacher', async () => {
    const response = await teacher.updateTeacher(
      teacher.newTeacher.id,
      teacher.mock.createDto,
    );

    return expect(response.statusCode).toBe(201);
  });

  it('should login as teacher', async () => {
    const response = await teacher.auth.login({
      email: teacher.newTeacher.user.username,
      password: 'password',
    });

    return expect(response.statusCode).toBe(200);
  });

  it('should delete teacher', async () => {
    await teacher.auth.login(teacher.auth.mock.loginPayload);
    const response = await teacher.deleteTeacher(teacher.newTeacher.id);

    return expect(response.statusCode).toBe(200);
  });
});
