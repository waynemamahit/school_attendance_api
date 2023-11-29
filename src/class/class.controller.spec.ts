import { Test, TestingModule } from '@nestjs/testing';
import { ClassController } from './class.controller';
import { classModuleConfig } from './class.module';

describe('ClassController', () => {
  let controller: ClassController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(classModuleConfig).compile();

    controller = module.get<ClassController>(ClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
