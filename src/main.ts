import fastifyCookie from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { randomBytes } from 'crypto';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );
  await app.register(fastifyHelmet);
  await app.register(fastifyCookie, {
    secret: randomBytes(16).toString('hex'),
  });
  await app.register(fastifyCsrfProtection, {
    cookieKey: 'csrf_key',
    cookieOpts: {
      secure: true,
      maxAge: 60 * 5,
    },
  });
  await app.register(fastifyCors, {
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix('v1');
  await app.listen(3000);
}
bootstrap();
