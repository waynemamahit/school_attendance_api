export interface GetClassQuery {
  name: string;
}

export interface UpdateClass {
  name: string;
  teacher_id: number;
}

export interface CreateClass extends UpdateClass {
  school_id: number;
}
