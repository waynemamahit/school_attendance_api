import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
} from '@nestjs/common';
import { User } from '@prisma/client';
import cookie from 'cookie';
import { FastifyRequest } from 'fastify';
import { AuthService } from '../auth/auth.service';
import { AbilityService } from './ability.service';

export const AbilityGuard = (abilityName: string, action: string) => {
  @Injectable()
  class AbilityGuardMixin implements CanActivate {
    constructor(
      public auth: AuthService,
      public ability: AbilityService,
    ) {}

    async canActivate(context: ExecutionContext) {
      const request: FastifyRequest = context.switchToHttp().getRequest();

      try {
        const user: User = await this.auth.getUserToken(
          request.headers.authorization?.split(' ')[1],
          cookie.parse(request.headers.cookie ?? '')['userKey'] ?? '',
        );
        if ((await this.auth.getUser(user.email, user.username)).role_id === 1)
          return true;
        const abilities = await this.ability.getRoleAbilities({
          role_id: user.role_id,
          ability: {
            name: abilityName,
            action,
          },
        });

        return abilities.length > 0;
      } catch {
        return false;
      }
    }
  }

  return mixin(AbilityGuardMixin);
};
