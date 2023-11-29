import { Test, TestingModule } from '@nestjs/testing';
import { studentConfigModule } from './student.module';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(studentConfigModule).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
