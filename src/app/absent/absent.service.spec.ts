import { Test, TestingModule } from '@nestjs/testing';
import { absentModuleMeta } from './absent.module';
import { AbsentService } from './absent.service';

describe('AbsentService', () => {
  let service: AbsentService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(absentModuleMeta).compile();

    service = module.get<AbsentService>(AbsentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
