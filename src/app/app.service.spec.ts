import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { appModuleMeta } from './app.module';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(appModuleMeta).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
