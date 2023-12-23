import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AbilityE2E } from './objects/ability.e2e';
import { initApp } from './utils/app.e2e-util';
import { initAuth } from './utils/auth.e2e-util';

describe('Ability Features', () => {
  let app: NestFastifyApplication;
  let abilityE2E: AbilityE2E;

  beforeAll(async () => {
    app = await initApp();
    abilityE2E = new AbilityE2E(app);
  });

  afterAll(() => app.close());

  it('should get all ability', async () => {
    abilityE2E.auth = await initAuth(
      app,
      {},
      {
        email: 'suadmin',
        password: 'password12345',
      },
    );

    const response = await abilityE2E.getAllAbility();

    return expect(response.statusCode).toBe(200);
  });

  it('should get all roles', async () => {
    const response = await abilityE2E.getRoles();

    return expect(response.statusCode).toBe(200);
  });

  it('should get all ability on roles', async () => {
    const response = await abilityE2E.getRoleAbilities();

    return expect(response.statusCode).toBe(200);
  });

  it('should not create new ability without payload', async () => {
    const response = await abilityE2E.createAbility();

    return expect(response.statusCode).toBe(400);
  });

  it('should create new ability', async () => {
    const response = await abilityE2E.createAbility({
      role_id: 1,
      ability_id: 1,
    });

    return expect(response.statusCode).toBe(201);
  });

  it('should delete ability', async () => {
    const response = await abilityE2E.deleteAbility();

    return expect(response.statusCode).toBe(200);
  });

  it('should not delete ability other than super admin', async () => {
    abilityE2E.auth = await initAuth(app);
    const response = await abilityE2E.deleteAbility();

    return expect(response.statusCode).toBe(403);
  });
});
