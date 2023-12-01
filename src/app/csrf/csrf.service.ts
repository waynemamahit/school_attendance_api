import Tokens from '@fastify/csrf';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CsrfService {
  tokens = new Tokens({
    saltLength: 12,
  });

  constructor(@Inject(CACHE_MANAGER) public cache: Cache) {}
}
