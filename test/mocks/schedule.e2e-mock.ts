import { faker } from '@faker-js/faker';
import { ScheduleDto } from '../../src/shared/pipes/zod/schedule.validation';

export class ScheduleE2EMock {
  dto: ScheduleDto = {
    day: faker.date.weekday({ abbreviated: true }).toUpperCase(),
    semester: Math.ceil(Math.random() * 8),
    course_id: 1,
  };
}
