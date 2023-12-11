import { Module, ModuleMetadata } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { TeacherModule } from '../teacher/teacher.module';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';

export const classModuleMeta: ModuleMetadata = {
  imports: [TeacherModule],
  controllers: [ClassController],
  providers: [ClassService, PrismaService],
};
@Module(classModuleMeta)
export class ClassModule {}
