import { Test, TestingModule } from '@nestjs/testing';
import { CsrfService } from './csrf.service';
import { csrfModuleMeta } from './csrf.module';

describe('CsrfService', () => {
  let service: CsrfService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(csrfModuleMeta).compile();

    service = await module.resolve(CsrfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
