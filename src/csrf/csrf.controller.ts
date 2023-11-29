import { Controller, Get, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CsrfService } from './csrf.service';

@Controller('csrf')
export class CsrfController {
  constructor(private readonly csrfService: CsrfService) {}

  @Get()
  async getToken(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const token = res.generateCsrf();
    await this.csrfService.cache.set(req.ip, token);
    return res.code(200).send(token);
  }
}
