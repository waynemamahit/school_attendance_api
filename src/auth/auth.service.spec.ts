import { Test, TestingModule } from '@nestjs/testing';
import { authModuleMeta } from './auth.module';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(authModuleMeta).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
