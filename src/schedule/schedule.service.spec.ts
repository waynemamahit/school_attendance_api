import { Test, TestingModule } from '@nestjs/testing';
import { scheduleModuleMeta } from './schedule.module';
import { ScheduleService } from './schedule.service';

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(scheduleModuleMeta).compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
