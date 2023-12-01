import { Module, ModuleMetadata } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';

export const teacherModuleMeta: ModuleMetadata = {
  controllers: [TeacherController],
  providers: [TeacherService],
};
@Module(teacherModuleMeta)
export class TeacherModule {}
