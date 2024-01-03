import { z } from 'zod';

export const scheduleSchemaDto = z
  .object({
    day: z.string(),
    semester: z.number(),
    course_id: z.number(),
  })
  .required();

export type ScheduleDto = z.infer<typeof scheduleSchemaDto>;
