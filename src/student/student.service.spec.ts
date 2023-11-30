import { Test, TestingModule } from '@nestjs/testing';
import { studentModuleMeta } from './student.module';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(studentModuleMeta).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
