import { AbilityGuard } from './ability.guard';

describe('AbilityGuard', () => {
  it('should be defined', () => {
    expect(AbilityGuard('absent', 'get')).toBeDefined();
  });
});
