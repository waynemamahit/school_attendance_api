import { Class } from '@prisma/client';
import { ClassDto } from '../../src/shared/pipes/zod/class.validation';
import { ClassE2EMock } from '../mocks/class.e2e-mock';
import { AuthE2E } from './auth.e2e';
import { BaseE2E } from './base.e2e';

export class ClassE2E extends BaseE2E {
  auth: AuthE2E;
  mock = new ClassE2EMock();
  newItem: Class;

  getClasses = async () => this.auth.getRequest(this.req.get('/class'));

  async createClass(dto: ClassDto = {}) {
    const response = await this.auth.getRequest(
      this.req.post('/class').send(dto),
    );

    if (response.statusCode === 201) this.newItem = response.body.data;

    return response;
  }

  showClass = async (id: number) =>
    await this.auth.getRequest(this.req.get('/class/' + id));

  updateClass = async (id: number, dto: ClassDto = {}) =>
    await this.auth.getRequest(this.req.put('/class/' + id).send(dto));

  deleteClass = async (id: number) =>
    await this.auth.getRequest(this.req.delete('/class/' + id));
}
