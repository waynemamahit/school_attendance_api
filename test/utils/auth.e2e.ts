import { faker } from '@faker-js/faker';

export const loginPayload = {
  email: faker.internet.email().toLowerCase(),
  password: 'password',
};

export const registerPayload = {
  user: {
    name: faker.person.fullName(),
    username: faker.person.firstName().toLowerCase(),
    ...loginPayload,
  },
  school: {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    latitude: 1.2231,
    longitude: 2.12123,
  },
};
