import { Module, ModuleMetadata } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';

export const teacherModuleConfig: ModuleMetadata = {
  controllers: [TeacherController],
  providers: [TeacherService],
};
@Module(teacherModuleConfig)
export class TeacherModule {}
