export interface BaseUser {
  name: string;
  username: string;
  email: string;
}

export interface CreateUser extends BaseUser {
  password: string;
  role_id: number;
  school_id: number;
}
