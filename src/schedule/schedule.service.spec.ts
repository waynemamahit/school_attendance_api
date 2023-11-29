import { Test, TestingModule } from '@nestjs/testing';
import { scheduleConfigModule } from './schedule.module';
import { ScheduleService } from './schedule.service';

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(scheduleConfigModule).compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
