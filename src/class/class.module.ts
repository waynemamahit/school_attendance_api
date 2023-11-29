import { Module, ModuleMetadata } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';

export const classModuleConfig: ModuleMetadata = {
  controllers: [ClassController],
  providers: [ClassService],
};
@Module(classModuleConfig)
export class ClassModule {}
