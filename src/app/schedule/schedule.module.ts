import { Module, ModuleMetadata } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

export const scheduleModuleMeta: ModuleMetadata = {
  providers: [ScheduleService],
  controllers: [ScheduleController],
};
@Module(scheduleModuleMeta)
export class ScheduleModule {}
