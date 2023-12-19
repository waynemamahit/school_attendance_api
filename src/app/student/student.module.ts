import { Module, ModuleMetadata } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { AbilityModule } from '../ability/ability.module';
import { AuthModule } from '../auth/auth.module';
import { ClassModule } from '../class/class.module';
import { SchoolModule } from '../school/school.module';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

export const studentModuleMeta: ModuleMetadata = {
  imports: [AuthModule, AbilityModule, ClassModule, SchoolModule],
  controllers: [StudentController],
  providers: [StudentService, PrismaService],
  exports: [StudentService],
};
@Module(studentModuleMeta)
export class StudentModule {}
