import { Teacher, User } from '@prisma/client';
import {
  CreateTeacherDto,
  TeacherDto,
} from '../../src/shared/pipes/zod/teacher.validation';
import { TeacherE2EMock } from '../mocks/teacher.e2e-mock';
import { AuthE2E } from './auth.e2e';
import { BaseE2E } from './base.e2e';

export class TeacherE2E extends BaseE2E {
  auth: AuthE2E;
  mock = new TeacherE2EMock();
  newTeacher: Teacher & {
    user: User;
  };

  getTeachers = async () =>
    await this.auth.getRequest(this.req.get('/teacher'));

  async createTeacher(dto: CreateTeacherDto = {}) {
    const response = await this.auth.getRequest(
      this.req.post('/teacher').send(dto),
    );

    if (response.statusCode === 201) this.newTeacher = response.body.data;

    return response;
  }

  async showTeacher(id: number) {
    return await this.auth.getRequest(this.req.get('/teacher/' + id));
  }

  updateTeacher = async (id: number, dto: TeacherDto = {}) =>
    await this.auth.getRequest(this.req.put('/teacher/' + id).send(dto));

  deleteTeacher = async (id: number) =>
    await this.auth.getRequest(this.req.delete('/teacher/' + id));
}
