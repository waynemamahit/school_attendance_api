import { Module, ModuleMetadata } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

export const authModuleMeta: ModuleMetadata = {
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
};
@Module(authModuleMeta)
export class AuthModule {}
