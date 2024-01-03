import { Course, Schedule } from '@prisma/client';
import { ScheduleDto } from '../../src/shared/pipes/zod/schedule.validation';
import { ScheduleE2EMock } from '../../test/mocks/schedule.e2e-mock';
import { AuthE2E } from './auth.e2e';
import { BaseE2E } from './base.e2e';

export default class ScheduleE2E extends BaseE2E {
  auth: AuthE2E;
  mock = new ScheduleE2EMock();
  newItem: Schedule & {
    course: Course;
  };

  async createSchedule(dto: ScheduleDto = {}) {
    const response = await this.auth.getRequest(
      this.req.post('/schedule').send(dto),
    );

    if (response.statusCode === 201) this.newItem = response.body.data;

    return response;
  }

  getSchedules = async () =>
    await this.auth.getRequest(this.req.get('/schedule'));

  showSchedule = async (id: number) =>
    await this.auth.getRequest(this.req.get('/schedule/' + id));

  updateSchedule = async (id: number, dto: ScheduleDto = {}) =>
    await this.auth.getRequest(this.req.put('/schedule/' + id).send(dto));

  deleteSchedule = async (id: number) =>
    await this.auth.getRequest(this.req.delete('/schedule/' + id));
}
