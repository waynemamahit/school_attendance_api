import { Test, TestingModule } from '@nestjs/testing';
import { AbilityController } from './ability.controller';
import { abilityModuleMeta } from './ability.module';

describe('AbilityController', () => {
  let controller: AbilityController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(abilityModuleMeta).compile();

    controller = module.get<AbilityController>(AbilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
