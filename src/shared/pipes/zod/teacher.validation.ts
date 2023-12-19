import { z } from 'zod';

export const teacherSchemaDto = z
  .object({
    name: z.string(),
    id_number: z.string(),
    email: z.string().email(),
    username: z.string(),
  })
  .required();

export type TeacherDto = z.infer<typeof teacherSchemaDto>;

export const createTeacherSchemaDto = z
  .object({
    password: z.string().optional(),
  })
  .merge(teacherSchemaDto)
  .required();

export type CreateTeacherDto = z.infer<typeof createTeacherSchemaDto>;
