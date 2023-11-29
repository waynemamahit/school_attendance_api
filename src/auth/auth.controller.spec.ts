import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { authConfigModule } from './auth.module';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(authConfigModule).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});