import { Module, ModuleMetadata } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

export const studentModuleMeta: ModuleMetadata = {
  controllers: [StudentController],
  providers: [StudentService],
};
@Module(studentModuleMeta)
export class StudentModule {}
