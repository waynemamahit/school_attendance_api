import { BaseUser } from './user.interface';

export interface GetStudentQuery extends BaseUser {
  className: string;
  id_number: string;
}

export interface CreateStudent {
  id_number: string;
  user_id: number;
  class_id: number;
}
