import { Module, ModuleMetadata } from '@nestjs/common';
import { CsrfModule } from '../csrf/csrf.module';
import { PrismaService } from '../shared/services/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

export const authConfigModule: ModuleMetadata = {
  imports: [CsrfModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
};
@Module(authConfigModule)
export class AuthModule {}
