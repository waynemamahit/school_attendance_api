import { Module, ModuleMetadata } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

export const courseConfigModule: ModuleMetadata = {
  controllers: [CourseController],
  providers: [CourseService],
};

@Module(courseConfigModule)
export class CourseModule {}
