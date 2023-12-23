import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { SchoolE2E } from './objects/school.e2e';
import { initApp } from './utils/app.e2e-util';
import { initAuth } from './utils/auth.e2e-util';

describe('School Features', () => {
  let app: NestFastifyApplication;
  let school: SchoolE2E;

  beforeAll(async () => {
    app = await initApp();
    school = new SchoolE2E(app);
  });

  afterAll(() => app.close());

  it('should get all school', async () => {
    school.auth = await initAuth(
      app,
      {},
      {
        email: 'suadmin',
        password: 'password12345',
      },
    );
    const response = await school.getAllSchool();

    return expect(response.statusCode).toBe(200);
  });

  it('should select school', async () => {
    const response = await school.selectSchool(school.newItem.id);

    return expect(response.statusCode).toBe(201);
  });

  it('should not update school without payload', async () => {
    const response = await school.updateSchool(school.newItem.id);

    return expect(response.statusCode).toBe(400);
  });

  it('should update school', async () => {
    const response = await school.updateSchool(
      school.newItem.id,
      school.mock.dto,
    );

    return expect(response.statusCode).toBe(201);
  });

  it('should not update school with invalid ID', async () => {
    school.auth = await initAuth(app);

    const response = await school.updateSchool(
      school.newItem.id,
      school.mock.dto,
    );

    return expect(response.statusCode).toBe(403);
  });

  it('should not select school without super admin', async () => {
    const response = await school.selectSchool(school.newItem.id);

    return expect(response.statusCode).toBe(403);
  });
});
