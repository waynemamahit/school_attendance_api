import { z } from 'zod';

export const createTeacherSchemaDto = z
  .object({
    name: z.string(),
    id_number: z.string(),
    email: z.string().email(),
    username: z.string(),
  })
  .required();

export type CreateTeacherDto = z.infer<typeof createTeacherSchemaDto>;

export const updateTeacherSchemaDto = z
  .object({
    name: z.string(),
    id_number: z.string(),
    email: z.string().email(),
    username: z.string(),
  })
  .required();

export type UpdateTeacherDto = z.infer<typeof updateTeacherSchemaDto>;
