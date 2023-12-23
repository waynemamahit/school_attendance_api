import { faker } from '@faker-js/faker';
import {
  LoginDto,
  RegisterDto,
} from '../../src/shared/pipes/zod/auth.validation';

export class AuthE2EMock {
  loginPayload: LoginDto;
  registerPayload: RegisterDto;

  constructor() {
    this.loginPayload = {
      email: faker.internet.email().toString().toLowerCase(),
      password: 'password',
    };

    this.registerPayload = {
      user: {
        name: faker.person.fullName(),
        username: faker.person.firstName().toString().toLowerCase(),
        ...this.loginPayload,
      },
      school: {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        latitude: 1.2231,
        longitude: 2.12123,
      },
    };
  }
}
