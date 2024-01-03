import { Module, ModuleMetadata } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { AbilityModule } from '../ability/ability.module';
import { AuthModule } from '../auth/auth.module';
import { CourseModule } from '../course/course.module';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

export const scheduleModuleMeta: ModuleMetadata = {
  imports: [AuthModule, AbilityModule, CourseModule],
  providers: [ScheduleService, PrismaService],
  controllers: [ScheduleController],
  exports: [ScheduleService],
};
@Module(scheduleModuleMeta)
export class ScheduleModule {}
