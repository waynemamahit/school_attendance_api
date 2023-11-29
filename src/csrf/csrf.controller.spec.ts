import { Test, TestingModule } from '@nestjs/testing';
import { CsrfController } from './csrf.controller';
import { csrfModuleConfig } from './csrf.module';

describe('CsrfController', () => {
  let controller: CsrfController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(csrfModuleConfig).compile();

    controller = module.get<CsrfController>(CsrfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
