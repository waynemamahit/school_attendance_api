import { ScheduleDay } from '@prisma/client';

export interface GetScheduleQuery {
  day: string;
  semester: number;
}

export interface CreateSchedule {
  day: ScheduleDay;
  semester: number;
  class_id: number;
  course_id: number;
}

export type UpdateSchedule = CreateSchedule;
