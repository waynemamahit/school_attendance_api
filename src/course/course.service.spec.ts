import { Test, TestingModule } from '@nestjs/testing';
import { courseModuleMeta } from './course.module';
import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(courseModuleMeta).compile();

    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
