import { Module, ModuleMetadata, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { AuthModule } from '../auth/auth.module';

export const schoolModuleMeta: ModuleMetadata = {
  imports: [forwardRef(() => AuthModule)],
  controllers: [SchoolController],
  providers: [SchoolService, PrismaService],
  exports: [SchoolService],
};
@Module(schoolModuleMeta)
export class SchoolModule {}
