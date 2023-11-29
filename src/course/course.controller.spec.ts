import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { courseConfigModule } from './course.module';

describe('CourseController', () => {
  let controller: CourseController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(courseConfigModule).compile();

    controller = module.get<CourseController>(CourseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
