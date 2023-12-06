import { BaseUser } from './user.interfaces';

export interface GetTeacherQuery extends BaseUser {
  id: string;
}

export interface CreateTeacher {
  id_number: string;
  user_id: number;
}
