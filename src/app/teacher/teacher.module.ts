import { Module, ModuleMetadata } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { AbilityModule } from '../ability/ability.module';
import { AuthModule } from '../auth/auth.module';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';

export const teacherModuleMeta: ModuleMetadata = {
  imports: [AuthModule, AbilityModule],
  controllers: [TeacherController],
  providers: [TeacherService, PrismaService],
  exports: [TeacherService],
};
@Module(teacherModuleMeta)
export class TeacherModule {}
