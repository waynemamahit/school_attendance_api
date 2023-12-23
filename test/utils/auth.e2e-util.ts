import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  LoginDto,
  RegisterDto,
} from '../../src/shared/pipes/zod/auth.validation';
import { AuthE2E } from '../objects/auth.e2e';

export const initAuth = async (
  app: NestFastifyApplication,
  registerDto?: RegisterDto,
  loginDto?: LoginDto,
) => {
  const auth = new AuthE2E(app);
  await auth.csrf.getTokenKey();
  await auth.register(registerDto ?? auth.mock.registerPayload);
  await auth.login(loginDto ?? auth.mock.loginPayload);

  return auth;
};
