import { Test, TestingModule } from '@nestjs/testing';
import { SchoolController } from './school.controller';
import { schoolModuleMeta } from './school.module';

describe('SchoolController', () => {
  let controller: SchoolController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(schoolModuleMeta).compile();

    controller = module.get<SchoolController>(SchoolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
