import { Test, TestingModule } from '@nestjs/testing';
import { SchoolService } from './school.service';
import { schoolModuleMeta } from './school.module';

describe('SchoolService', () => {
  let service: SchoolService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(schoolModuleMeta).compile();

    service = module.get<SchoolService>(SchoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
