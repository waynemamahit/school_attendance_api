import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { randomBytes } from 'crypto';
import { RawServerDefault } from 'fastify';

export const initPlugin = async (
  app: NestFastifyApplication<RawServerDefault>,
) => {
  await app.register(fastifyHelmet as any);
  await app.register(fastifyCookie as any, {
    secret: randomBytes(16).toString('hex'),
  });
  await app.register(fastifyCsrfProtection as any, {
    cookieKey: 'csrf_key',
    cookieOpts: {
      secure: true,
      maxAge: 60 * 5,
    },
  });
  await app.register(fastifyCors as any, {
    origin: true,
    credentials: true,
  });
};
