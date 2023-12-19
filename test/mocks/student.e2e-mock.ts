import { faker } from '@faker-js/faker';
import { randomBytes } from 'crypto';

export const studentPayload = {
  name: faker.person.fullName(),
  id_number: randomBytes(12).toString('hex'),
  email: faker.internet.email(),
  username: faker.person.firstName(),
  password: 'password',
  class_id: 1,
};
