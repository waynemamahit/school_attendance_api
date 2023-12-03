import { z } from 'zod';

const toUpper = (val: string) => val.toUpperCase();

export const loginSchemaDto = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .required();

export type LoginDto = z.infer<typeof loginSchemaDto>;

export const registerSchemaDto = z
  .object({
    user: z
      .object({
        name: z.string().transform(toUpper),
        username: z.string().optional(),
        email: z.string(),
        password: z.string(),
      })
      .required(),
    school: z
      .object({
        name: z.string().transform(toUpper),
        address: z.string().transform(toUpper),
        latitude: z.number(),
        longitude: z.number(),
      })
      .required(),
  })
  .required();

export type RegisterDto = z.infer<typeof registerSchemaDto>;
