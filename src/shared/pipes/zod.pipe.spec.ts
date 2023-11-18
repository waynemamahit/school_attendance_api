import { ZodPipe } from './zod.pipe';
import { loginSchemaDto } from './zod/auth.validation';

describe('ZodPipe', () => {
  it('should be defined', () => {
    expect(new ZodPipe(loginSchemaDto)).toBeDefined();
  });
});
