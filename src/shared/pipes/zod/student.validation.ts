import { z } from 'zod';

export const studentSchemaDto = z
  .object({
    name: z.string(),
    id_number: z.string(),
    email: z.string().email(),
    username: z.string(),
    password: z.string().optional(),
    class_id: z.number(),
  })
  .required();

export type StudentDto = z.infer<typeof studentSchemaDto>;
