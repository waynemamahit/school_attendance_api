import { Module, ModuleMetadata } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

export const courseModuleMeta: ModuleMetadata = {
  controllers: [CourseController],
  providers: [CourseService],
};

@Module(courseModuleMeta)
export class CourseModule {}
