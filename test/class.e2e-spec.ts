import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ClassE2E } from './objects/class.e2e';
import { TeacherE2E } from './objects/teacher.e2e';
import { initApp } from './utils/app.e2e-util';
import { initAuth } from './utils/auth.e2e-util';

describe('Class Features', () => {
  let app: NestFastifyApplication;
  let classE2E: ClassE2E;
  let teacher: TeacherE2E;

  beforeAll(async () => {
    app = await initApp();
    classE2E = new ClassE2E(app);
    teacher = new TeacherE2E(app);
  });

  afterAll(() => app.close());

  it('should get all class', async () => {
    classE2E.auth = await initAuth(app);

    const response = await classE2E.getClasses();

    return expect(response.statusCode).toBe(200);
  });

  it('should not create new class without payload', async () => {
    const response = await classE2E.createClass();

    return expect(response.statusCode).toBe(400);
  });

  it('should create new class', async () => {
    teacher.auth = classE2E.auth;
    await teacher.createTeacher(teacher.mock.createDto);
    classE2E.mock.dto.teacher_id = teacher.newTeacher.id;
    delete teacher.auth;

    const response = await classE2E.createClass(classE2E.mock.dto);

    return expect(response.statusCode).toBe(201);
  });

  it('should get class', async () => {
    const response = await classE2E.showClass(classE2E.newItem.id);

    return expect(response.statusCode).toBe(200);
  });

  it('should not update class without payload', async () => {
    const response = await classE2E.updateClass(classE2E.newItem.id);

    return expect(response.statusCode).toBe(400);
  });

  it('should update class', async () => {
    const response = await classE2E.updateClass(
      classE2E.newItem.id,
      classE2E.mock.dto,
    );

    return expect(response.statusCode).toBe(201);
  });

  it('should delete class', async () => {
    const response = await classE2E.deleteClass(classE2E.newItem.id);

    return expect(response.statusCode).toBe(200);
  });
});
