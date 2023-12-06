import { Module, ModuleMetadata } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';

export const teacherModuleMeta: ModuleMetadata = {
  imports: [AuthModule],
  controllers: [TeacherController],
  providers: [TeacherService, PrismaService],
};
@Module(teacherModuleMeta)
export class TeacherModule {}
