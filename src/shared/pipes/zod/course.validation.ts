import { z } from 'zod';

export const courseSchemaDto = z
  .object({
    subject_number: z.string(),
    curriculum: z.string(),
    name: z.string(),
    class_id: z.number(),
  })
  .required();

export type CourseDto = z.infer<typeof courseSchemaDto>;

export const courseTeacherSchemaDto = z
  .object({
    course_id: z.number(),
    teacher_id: z.number(),
  })
  .required();

export type CourseTeacherDto = z.infer<typeof courseTeacherSchemaDto>;
