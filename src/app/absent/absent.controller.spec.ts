import { Test, TestingModule } from '@nestjs/testing';
import { AbsentController } from './absent.controller';
import { absentModuleMeta } from './absent.module';

describe('AbsentController', () => {
  let controller: AbsentController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(absentModuleMeta).compile();

    controller = module.get<AbsentController>(AbsentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
