import { Test, TestingModule } from '@nestjs/testing';
import { absentConfigModule } from './absent.module';
import { AbsentService } from './absent.service';

describe('AbsentService', () => {
  let service: AbsentService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(absentConfigModule).compile();

    service = module.get<AbsentService>(AbsentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
