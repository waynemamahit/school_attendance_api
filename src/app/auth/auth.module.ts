import { Module, ModuleMetadata } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../../shared/services/mail.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { SchoolModule } from '../school/school.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

export const authModuleMeta: ModuleMetadata = {
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '30d' },
    }),
    SchoolModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, MailService],
  exports: [AuthService],
};
@Module(authModuleMeta)
export class AuthModule {}
