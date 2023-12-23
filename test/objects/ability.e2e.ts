import { RoleAbility } from '@prisma/client';
import { CreateAbilityDto } from 'src/shared/pipes/zod/ability.validation';
import { AuthE2E } from './auth.e2e';
import { BaseE2E } from './base.e2e';

export class AbilityE2E extends BaseE2E {
  auth: AuthE2E;
  newRoleAbility: RoleAbility;

  getAllAbility = async () =>
    await this.auth.getRequest(this.req.get('/ability'));

  getRoles = async () => await this.auth.getRequest(this.req.get('/role'));

  getRoleAbilities = async () =>
    await this.auth.getRequest(this.req.get('/ability/role'));

  async createAbility(data: CreateAbilityDto = {}) {
    const response = await this.auth.getRequest(
      this.req.post('/ability/role').send(data),
    );

    if (response.statusCode === 201) {
      this.newRoleAbility = response.body.data;
    }

    return response;
  }

  deleteAbility = async () =>
    await this.auth.getRequest(
      this.req.delete('/ability/role/' + this.newRoleAbility.id),
    );
}
