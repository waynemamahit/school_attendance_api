import { School } from '@prisma/client';
import { UpdateSchoolDto } from '../../src/shared/pipes/zod/school.validation';
import { SchoolE2EMock } from '../mocks/school.e2e-mock';
import { AuthE2E } from './auth.e2e';
import { BaseE2E } from './base.e2e';

export class SchoolE2E extends BaseE2E {
  auth: AuthE2E;
  mock = new SchoolE2EMock();
  newItem: School;

  async getAllSchool() {
    const response = await this.auth.getRequest(this.req.get('/school'));

    if (response.statusCode === 200) {
      const data = response.body.data;
      if (data.length > 0) {
        this.newItem = data[Math.floor(Math.random() * data.length)];
      }
    }

    return response;
  }

  selectSchool = async (id: number) =>
    await this.auth.getRequest(this.req.get('/school/' + id));

  updateSchool = async (id: number, dto: UpdateSchoolDto = {}) =>
    await this.auth.getRequest(this.req.put('/school/' + id).send(dto));
}
