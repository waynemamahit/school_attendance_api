import { CacheModule } from '@nestjs/cache-manager';
import {
  MiddlewareConsumer,
  Module,
  ModuleMetadata,
  RequestMethod,
} from '@nestjs/common';
import { CsrfMiddleware } from '../middleware/csrf.middleware';
import { CsrfService } from '../services/csrf.service';

export const csrfModuleConfig: ModuleMetadata = {
  imports: [
    CacheModule.register({
      ttl: 1000 * 60 * 5,
    }),
  ],
  providers: [CsrfService, CsrfMiddleware],
  exports: [CsrfService],
};
@Module(csrfModuleConfig)
export class CsrfModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes({
      path: 'login',
      method: RequestMethod.POST,
    });
  }
}
