import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { studentModuleMeta } from './student.module';

describe('StudentController', () => {
  let controller: StudentController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(studentModuleMeta).compile();

    controller = module.get<StudentController>(StudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
