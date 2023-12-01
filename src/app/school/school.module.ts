import { Module, ModuleMetadata } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';

export const schoolModuleMeta: ModuleMetadata = {
  controllers: [SchoolController],
  providers: [SchoolService],
};
@Module(schoolModuleMeta)
export class SchoolModule {}
