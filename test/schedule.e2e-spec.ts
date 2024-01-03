import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ClassE2E } from './objects/class.e2e';
import { CourseE2E } from './objects/course.e2e';
import ScheduleE2E from './objects/schedule.e2e';
import { TeacherE2E } from './objects/teacher.e2e';
import { initApp } from './utils/app.e2e-util';
import { initAuth } from './utils/auth.e2e-util';

describe('Schedule Features', () => {
  let app: NestFastifyApplication;
  let schedule: ScheduleE2E;
  let course: CourseE2E;
  let classE2E: ClassE2E;
  let teacher: TeacherE2E;

  beforeAll(async () => {
    app = await initApp();
    course = new CourseE2E(app);
    schedule = new ScheduleE2E(app);
    classE2E = new ClassE2E(app);
    teacher = new TeacherE2E(app);
    const auth = await initAuth(app);
    teacher.auth = auth;
    classE2E.auth = auth;
    course.auth = auth;
    schedule.auth = auth;
  });

  it('should not be create new schedule without payload', async () => {
    const response = await schedule.createSchedule();

    expect(response.statusCode).toBe(400);
  });

  it('should be create new schedule', async () => {
    await teacher.createTeacher(teacher.mock.createDto);
    classE2E.mock.dto.teacher_id = teacher.newTeacher.id;
    await classE2E.createClass(classE2E.mock.dto);
    course.mock.dto.class_id = classE2E.newItem.id;
    await course.createCourse(course.mock.dto);
    schedule.mock.dto.course_id = course.newItem.id;

    const response = await schedule.createSchedule(schedule.mock.dto);

    expect(response.statusCode).toBe(201);
  });

  it('should be get schedules', async () => {
    const response = await schedule.getSchedules();

    expect(response.statusCode).toBe(200);
  });

  it('should be show schedule', async () => {
    const response = await schedule.showSchedule(schedule.newItem.id);

    expect(response.statusCode).toBe(200);
  });

  it('should not be update schedule without payload', async () => {
    const response = await schedule.createSchedule();

    expect(response.statusCode).toBe(400);
  });

  it('should be update schedule', async () => {
    const { mock, newItem, updateSchedule } = schedule;
    const response = await updateSchedule(newItem.id, mock.dto);

    expect(response.statusCode).toBe(201);
  });

  it('should be delete schedule', async () => {
    const response = await schedule.deleteSchedule(schedule.newItem.id);

    expect(response.statusCode).toBe(200);
  });
});
