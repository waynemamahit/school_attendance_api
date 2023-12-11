import { faker } from '@faker-js/faker';
import { randomBytes } from 'crypto';

export const teacherPayload = {
  name: faker.person.fullName(),
  id_number: randomBytes(12).toString('hex'),
  email: faker.internet.email(),
  username: faker.person.firstName(),
};
