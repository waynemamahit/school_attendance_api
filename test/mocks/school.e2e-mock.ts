import { faker } from '@faker-js/faker';
import { UpdateSchoolDto } from 'src/shared/pipes/zod/school.validation';

export class SchoolE2EMock {
  dto: UpdateSchoolDto;

  constructor() {
    this.dto = {
      name: faker.location.city(),
      address: faker.location.streetAddress(),
    };
  }
}
