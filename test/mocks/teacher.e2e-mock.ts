import { faker } from '@faker-js/faker';
import { randomBytes } from 'crypto';
import { CreateTeacherDto } from 'src/shared/pipes/zod/teacher.validation';

export class TeacherE2EMock {
  createDto: CreateTeacherDto;

  constructor() {
    this.createDto = {
      name: faker.person.fullName(),
      id_number: randomBytes(12).toString('hex'),
      email: faker.internet.email(),
      username: faker.person.firstName(),
      password: 'password',
    };
  }
}
