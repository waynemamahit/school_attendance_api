import { Course, Teacher, TeacherCourse } from '@prisma/client';
import {
  CourseDto,
  CourseTeacherDto,
} from '../../src/shared/pipes/zod/course.validation';
import { CourseE2EMock } from '../mocks/course.e2e-mock';
import { AuthE2E } from './auth.e2e';
import { BaseE2E } from './base.e2e';

export class CourseE2E extends BaseE2E {
  auth: AuthE2E;
  mock = new CourseE2EMock();
  newItem: Course;
  newTeacherCourse: TeacherCourse & {
    teacher: Teacher;
    course: Course;
  };

  getCourses = async () => await this.auth.getRequest(this.req.get('/course'));

  async createCourse(dto: CourseDto = {}) {
    const response = await this.auth.getRequest(
      this.req.post('/course').send(dto),
    );

    if (response.statusCode === 201) {
      this.newItem = response.body.data;
      this.mock.teacherDto.course_id = this.newItem.id;
    }

    return response;
  }

  async addTeacherCourse(dto: CourseTeacherDto = {}) {
    const response = await this.auth.getRequest(
      this.req.post('/course/teacher').send(dto),
    );

    if (response.statusCode === 201) this.newTeacherCourse = response.body.data;

    return response;
  }

  showCourse = async (id: number) =>
    await this.auth.getRequest(this.req.get('/course/' + id));

  updateCourse = async (id: number, dto: CourseDto = {}) =>
    await this.auth.getRequest(this.req.put('/course/' + id).send(dto));

  deleteCourse = async (id: number) =>
    await this.auth.getRequest(this.req.delete('/course/' + id));

  deleteTeacherCourse = async (id: number) =>
    await this.auth.getRequest(this.req.delete('/course/teacher/' + id));
}
