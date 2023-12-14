import { z } from 'zod';

export const createAbilitySchemaDto = z
  .object({
    role_id: z.number(),
    ability_id: z.number(),
  })
  .required();

export type CreateAbilityDto = z.infer<typeof createAbilitySchemaDto>;
