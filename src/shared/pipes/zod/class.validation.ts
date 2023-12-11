import { z } from 'zod';

export const classSchemaDto = z
  .object({
    name: z.string(),
    teacher_id: z.number(),
  })
  .required();

export type ClassDto = z.infer<typeof classSchemaDto>;
