import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ClassE2E } from './objects/class.e2e';
import { StudentE2E } from './objects/student.e2e';
import { TeacherE2E } from './objects/teacher.e2e';
import { initApp } from './utils/app.e2e-util';
import { initAuth } from './utils/auth.e2e-util';

describe('Student Features', () => {
  let app: NestFastifyApplication;
  let student: StudentE2E;
  let teacher: TeacherE2E;
  let classE2E: ClassE2E;

  beforeAll(async () => {
    app = await initApp();
    student = new StudentE2E(app);
    teacher = new TeacherE2E(app);
    classE2E = new ClassE2E(app);
  });

  afterAll(() => app.close());

  it('should get all student', async () => {
    const auth = await initAuth(app);
    student.auth = auth;
    teacher.auth = auth;
    await teacher.createTeacher(teacher.mock.createDto);
    classE2E.mock.dto.teacher_id = teacher.newTeacher.id;
    delete teacher.auth;
    classE2E.auth = auth;
    await classE2E.createClass(classE2E.mock.dto);
    student.mock.dto.class_id = classE2E.newItem.id;

    const response = await student.getStudents();

    return expect(response.statusCode).toBe(200);
  });

  it('should not create new student without payload', async () => {
    const response = await student.createStudent();

    return expect(response.statusCode).toBe(400);
  });

  it('should create new student', async () => {
    const response = await student.createStudent(student.mock.dto);

    return expect(response.statusCode).toBe(201);
  });

  it('should get student', async () => {
    const response = await student.showStudent(student.newStudent.id);

    return expect(response.statusCode).toBe(200);
  });

  it('should not update student without payload', async () => {
    const response = await student.updateStudent(student.newStudent.id);

    return expect(response.statusCode).toBe(400);
  });

  it('should update student', async () => {
    const { newStudent, mock } = student;
    const response = await student.updateStudent(newStudent.id, mock.dto);

    return expect(response.statusCode).toBe(201);
  });

  it('should delete student', async () => {
    const response = await student.deleteStudent(student.newStudent.id);

    return expect(response.statusCode).toBe(200);
  });
});
