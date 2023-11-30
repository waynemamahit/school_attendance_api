import { Test, TestingModule } from '@nestjs/testing';
import { CsrfMiddleware } from './csrf.middleware';
import { csrfModuleMeta } from './csrf.module';

describe('CsrfMiddleware', () => {
  let middleware: CsrfMiddleware;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(csrfModuleMeta).compile();

    middleware = module.get<CsrfMiddleware>(CsrfMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
