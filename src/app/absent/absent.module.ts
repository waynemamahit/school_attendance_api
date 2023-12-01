import { Module, ModuleMetadata } from '@nestjs/common';
import { AbsentController } from './absent.controller';
import { AbsentService } from './absent.service';

export const absentModuleMeta: ModuleMetadata = {
  controllers: [AbsentController],
  providers: [AbsentService],
};
@Module(absentModuleMeta)
export class AbsentModule {}
