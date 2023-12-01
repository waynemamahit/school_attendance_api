import { Test, TestingModule } from '@nestjs/testing';
import { classModuleMeta } from './class.module';
import { ClassService } from './class.service';

describe('ClassService', () => {
  let service: ClassService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(classModuleMeta).compile();

    service = module.get<ClassService>(ClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
