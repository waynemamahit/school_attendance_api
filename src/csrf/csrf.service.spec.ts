import { Test, TestingModule } from '@nestjs/testing';
import { CsrfService } from './csrf.service';
import { csrfModuleConfig } from './csrf.module';

describe('CsrfService', () => {
  let service: CsrfService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(csrfModuleConfig).compile();

    service = await module.resolve(CsrfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
