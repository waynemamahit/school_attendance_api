import { CacheModule } from '@nestjs/cache-manager';
import {
  MiddlewareConsumer,
  Module,
  ModuleMetadata,
  RequestMethod,
} from '@nestjs/common';
import { CsrfController } from './csrf.controller';
import { CsrfService } from './csrf.service';
import { CsrfMiddleware } from './csrf.middleware';

export const csrfModuleMeta: ModuleMetadata = {
  imports: [
    CacheModule.register({
      ttl: 1000 * 60 * 5,
    }),
  ],
  controllers: [CsrfController],
  providers: [CsrfService, CsrfMiddleware],
  exports: [CsrfService],
};
@Module(csrfModuleMeta)
export class CsrfModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CsrfMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
