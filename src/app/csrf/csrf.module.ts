import { CacheModule } from '@nestjs/cache-manager';
import {
  MiddlewareConsumer,
  Module,
  ModuleMetadata,
  RequestMethod,
} from '@nestjs/common';
import { CsrfController } from './csrf.controller';
import { CsrfMiddleware } from './csrf.middleware';
import { CsrfService } from './csrf.service';

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
      .forRoutes(
        { path: 'auth/*', method: RequestMethod.ALL },
        { path: 'teacher/*', method: RequestMethod.ALL },
        { path: 'class/*', method: RequestMethod.ALL },
        { path: 'ability/*', method: RequestMethod.ALL },
        { path: 'role/*', method: RequestMethod.ALL },
        { path: 'school/*', method: RequestMethod.ALL },
        { path: 'student/*', method: RequestMethod.ALL },
      );
  }
}
