import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(AuthGuard(false)).toBeDefined();
  });
});
