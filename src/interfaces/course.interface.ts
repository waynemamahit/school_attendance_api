import { GetClassQuery } from './class.interfaces';

export interface GetCourseQuery extends GetClassQuery {
  subject_number: string;
  curriculum: string;
}

export interface CreateCourse extends GetCourseQuery {
  class_id: number;
}

export type UpdateCourse = CreateCourse;

export interface AddTeacherCourse {
  teacher_id: number;
  course_id: number;
}
