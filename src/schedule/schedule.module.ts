import { Module, ModuleMetadata } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

export const scheduleConfigModule: ModuleMetadata = {
  providers: [ScheduleService],
  controllers: [ScheduleController],
};
@Module(scheduleConfigModule)
export class ScheduleModule {}
