import { Test, TestingModule } from '@nestjs/testing';
import { abilityModuleMeta } from './ability.module';
import { AbilityService } from './ability.service';

describe('AbilityService', () => {
  let service: AbilityService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(abilityModuleMeta).compile();

    service = module.get<AbilityService>(AbilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
