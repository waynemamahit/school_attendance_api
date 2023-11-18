import { Module, ModuleMetadata } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import AppController from './app.controller';
import { AppService } from './app.service';
import { CsrfModule } from './shared/modules/csrf.module';

export const appModuleConfig: ModuleMetadata = {
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    CsrfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
};
@Module(appModuleConfig)
export class AppModule {}
