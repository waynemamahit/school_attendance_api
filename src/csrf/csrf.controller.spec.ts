import { Test, TestingModule } from '@nestjs/testing';
import { CsrfController } from './csrf.controller';
import { csrfModuleMeta } from './csrf.module';

describe('CsrfController', () => {
  let controller: CsrfController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(csrfModuleMeta).compile();

    controller = module.get<CsrfController>(CsrfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
