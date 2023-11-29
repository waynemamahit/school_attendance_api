import { z } from 'zod';

const matpelGuruDtoObject = z.object({
  id: z.number(),
  keterangan: z.string().optional(),
});

export const createGuruDtoSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    nomor_induk: z.string(),
    kelas_id: z.number().optional(),
    matpels: z.array(matpelGuruDtoObject).optional(),
  })
  .required();

export type CreateGuruDto = z.infer<typeof createGuruDtoSchema>;
export type MatpelGuruDto = z.infer<typeof matpelGuruDtoObject>;
