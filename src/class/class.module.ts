import { Module, ModuleMetadata } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';

export const classModuleMeta: ModuleMetadata = {
  controllers: [ClassController],
  providers: [ClassService],
};
@Module(classModuleMeta)
export class ClassModule {}
