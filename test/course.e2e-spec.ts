import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ClassE2E } from './objects/class.e2e';
import { CourseE2E } from './objects/course.e2e';
import { TeacherE2E } from './objects/teacher.e2e';
import { initApp } from './utils/app.e2e-util';
import { initAuth } from './utils/auth.e2e-util';

describe('Course Features', () => {
  let app: NestFastifyApplication;
  let course: CourseE2E;
  let classE2E: ClassE2E;
  let teacher: TeacherE2E;

  beforeAll(async () => {
    app = await initApp();
    course = new CourseE2E(app);
    teacher = new TeacherE2E(app);
    classE2E = new ClassE2E(app);

    const auth = await initAuth(app);
    course.auth = auth;
    teacher.auth = auth;
    await teacher.createTeacher(teacher.mock.createDto);
    classE2E.auth = auth;
    classE2E.mock.dto.teacher_id = teacher.newTeacher.id;
    await classE2E.createClass(classE2E.mock.dto);
    course.mock.dto.class_id = classE2E.newItem.id;
  });

  it('should get all course', async () => {
    const response = await course.getCourses();

    expect(response.statusCode).toBe(200);
  });

  it('should not create new course without payload', async () => {
    const response = await course.createCourse();

    expect(response.statusCode).toBe(400);
  });

  it('should create new course', async () => {
    const response = await course.createCourse(course.mock.dto);

    expect(response.statusCode).toBe(201);
  });

  it('should add course for teacher', async () => {
    const response = await course.addTeacherCourse(course.mock.teacherDto);

    expect(response.statusCode).toBe(201);
  });

  it('should show course and teachers can hold', async () => {
    const response = await course.showCourse(course.newItem.id);

    expect(response.statusCode).toBe(200);
  });

  it('should not update course without payload', async () => {
    const response = await course.updateCourse(course.newItem.id);

    expect(response.statusCode).toBe(400);
  });

  it('should update course', async () => {
    const response = await course.updateCourse(
      course.newItem.id,
      course.mock.dto,
    );

    expect(response.statusCode).toBe(201);
  });

  it('should delete course for teacher', async () => {
    const response = await course.deleteTeacherCourse(
      course.newTeacherCourse.id,
    );

    expect(response.statusCode).toBe(200);
  });

  it('should delete course', async () => {
    const response = await course.deleteCourse(course.newItem.id);

    expect(response.statusCode).toBe(200);
  });
});
