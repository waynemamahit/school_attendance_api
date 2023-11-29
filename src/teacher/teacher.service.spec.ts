import { Test, TestingModule } from '@nestjs/testing';
import { teacherModuleConfig } from './teacher.module';
import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(teacherModuleConfig).compile();

    service = module.get<TeacherService>(TeacherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
