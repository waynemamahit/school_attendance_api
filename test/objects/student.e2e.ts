import { Student, User } from '@prisma/client';
import { StudentDto } from '../../src/shared/pipes/zod/student.validation';
import { StudentE2EMock } from '../mocks/student.e2e-mock';
import { AuthE2E } from './auth.e2e';
import { BaseE2E } from './base.e2e';

export class StudentE2E extends BaseE2E {
  auth: AuthE2E;
  mock = new StudentE2EMock();
  newStudent: Student & {
    user: User;
  };

  getStudents = async () =>
    await this.auth.getRequest(this.req.get('/student'));

  async createStudent(dto: StudentDto = {}) {
    const response = await this.auth.getRequest(
      this.req.post('/student').send(dto),
    );

    if (response.statusCode === 201) this.newStudent = response.body.data;

    return response;
  }

  showStudent = async (id: number) =>
    await this.auth.getRequest(this.req.get('/student/' + id));

  updateStudent = async (id: number, dto: StudentDto = {}) =>
    await this.auth.getRequest(this.req.put('/student/' + id).send(dto));

  deleteStudent = async (id: number) =>
    await this.auth.getRequest(this.req.delete('/student/' + id));
}
