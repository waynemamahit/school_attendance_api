import { z } from 'zod';

const toUpper = (val: string) => val.toUpperCase();

const userObject = z.object({
  email: z.string(),
  password: z.string(),
});

export const loginSchemaDto = userObject.required();

export type LoginDto = z.infer<typeof loginSchemaDto>;

export const registerSchemaDto = z
  .object({
    user: z
      .object({
        name: z.string().transform(toUpper),
        username: z.string().optional(),
      })
      .merge(userObject)
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
