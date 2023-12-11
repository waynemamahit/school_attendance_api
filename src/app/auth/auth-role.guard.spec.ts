import { AuthRoleGuard } from './auth-role.guard';

describe('AuthRoleGuard', () => {
  it('should be defined', () => {
    expect(AuthRoleGuard(1)).toBeDefined();
  });
});
