import { Module, ModuleMetadata } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';

export const schoolModuleMeta: ModuleMetadata = {
  controllers: [SchoolController],
  providers: [SchoolService, PrismaService],
  exports: [SchoolService],
};
@Module(schoolModuleMeta)
export class SchoolModule {}
