import { BaseUser } from './user.interface';

export interface GetTeacherQuery extends BaseUser {
  id_number: string;
}

export interface CreateTeacher {
  id_number: string;
  user_id: number;
}
