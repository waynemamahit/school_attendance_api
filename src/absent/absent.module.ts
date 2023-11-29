import { Module, ModuleMetadata } from '@nestjs/common';
import { AbsentController } from './absent.controller';
import { AbsentService } from './absent.service';

export const absentConfigModule: ModuleMetadata = {
  controllers: [AbsentController],
  providers: [AbsentService],
};
@Module(absentConfigModule)
export class AbsentModule {}
