import { faker } from '@faker-js/faker';
import { randomBytes } from 'crypto';
import { StudentDto } from 'src/shared/pipes/zod/student.validation';

export class StudentE2EMock {
  dto: StudentDto;

  constructor() {
    this.dto = {
      name: faker.person.fullName(),
      id_number: randomBytes(12).toString('hex'),
      email: faker.internet.email(),
      username: faker.person.firstName(),
      password: 'password',
      class_id: 1,
    };
  }
}
