import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AuthE2E } from './objects/auth.e2e';
import { initApp } from './utils/app.e2e-util';

describe('Authentication and Authorization', () => {
  let app: NestFastifyApplication;
  let authE2E: AuthE2E;

  beforeAll(async () => {
    app = await initApp();
    authE2E = new AuthE2E(app);
  });

  afterAll(() => app.close());

  it('should not register without csrf token and key', async () => {
    const response = await authE2E.register(
      authE2E.mock.registerPayload,
      false,
    );

    return expect(response.statusCode).toBe(419);
  });

  it('should not login without csrf token and key', async () => {
    const response = await authE2E.login(authE2E.mock.loginPayload, false);

    return expect(response.statusCode).toBe(419);
  });

  it('should get token CSRF', async () => {
    const response = await authE2E.csrf.getTokenKey();

    return expect(response.status).toBe(200);
  });

  it('should not register without payload', async () => {
    const response = await authE2E.register();

    return expect(response.statusCode).toBe(400);
  });

  it('should register', async () => {
    const response = await authE2E.register(authE2E.mock.registerPayload);

    return expect(response.statusCode).toBe(201);
  });

  it('should not login without payload', async () => {
    const response = await authE2E.login();

    return expect(response.statusCode).toBe(400);
  });

  it('should login', async () => {
    const response = await authE2E.login(authE2E.mock.loginPayload);

    return expect(response.statusCode).toBe(200);
  });
});
