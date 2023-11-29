import { Module, ModuleMetadata } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

export const studentConfigModule: ModuleMetadata = {
  controllers: [StudentController],
  providers: [StudentService],
};
@Module(studentConfigModule)
export class StudentModule {}
