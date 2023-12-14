import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { AbilityController } from './ability.controller';
import { AbilityService } from './ability.service';

export const abilityModuleMeta = {
  imports: [AuthModule],
  controllers: [AbilityController],
  providers: [AbilityService, PrismaService],
  exports: [AbilityService],
};
@Module(abilityModuleMeta)
export class AbilityModule {}
