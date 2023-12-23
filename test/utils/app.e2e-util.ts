import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { appModuleMeta } from '../../src/app/app.module';
import { initPlugin } from '../../src/init';

export const initApp = async () => {
  const app: NestFastifyApplication = (
    await Test.createTestingModule(appModuleMeta).compile()
  ).createNestApplication<NestFastifyApplication>(new FastifyAdapter());
  await initPlugin(app);
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return app;
};
