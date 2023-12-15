import { z } from 'zod';

export const updateSchoolSchemaDto = z
  .object({
    name: z.string(),
    address: z.string(),
  })
  .required();

export type UpdateSchoolDto = z.infer<typeof updateSchoolSchemaDto>;
