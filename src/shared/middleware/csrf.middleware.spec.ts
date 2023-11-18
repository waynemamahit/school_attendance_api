import { Test, TestingModule } from '@nestjs/testing';
import { csrfModuleConfig } from '../modules/csrf.module';
import { CsrfMiddleware } from './csrf.middleware';

describe('CsrfMiddleware', () => {
  let middleware: CsrfMiddleware;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(csrfModuleConfig).compile();

    middleware = await module.resolve(CsrfMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
