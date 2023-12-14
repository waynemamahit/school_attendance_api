export interface GetAbilityQuery {
  name: string;
  action: string;
}

export interface GetRoleAbilityQuery extends GetAbilityQuery {
  role_id: number;
}
