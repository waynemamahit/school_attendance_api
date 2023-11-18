import { z } from 'zod';

export const loginSchemaDto = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .required();

export type LoginDto = z.infer<typeof loginSchemaDto>;
