import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { teacherModuleMeta } from './teacher.module';

describe('TeacherController', () => {
  let controller: TeacherController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(teacherModuleMeta).compile();

    controller = module.get<TeacherController>(TeacherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
