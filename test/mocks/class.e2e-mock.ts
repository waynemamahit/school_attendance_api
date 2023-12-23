import { faker } from '@faker-js/faker';
import { ClassDto } from 'src/shared/pipes/zod/class.validation';

export class ClassE2EMock {
  dto: ClassDto;

  constructor() {
    this.dto = {
      name: faker.location.city(),
      teacher_id: 1,
    };
  }
}
