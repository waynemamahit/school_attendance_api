import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { AppService } from './app.service';
import { CsrfService } from './shared/services/csrf.service';

@Controller()
export default class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly csrfService: CsrfService,
  ) {}

  @Get('csrf')
  async getToken(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const token = res.generateCsrf();
    await this.csrfService.cache.set(req.ip, token);
    return res.code(200).send(token);
  }

  @Post('login')
  login(@Req() req: FastifyRequest) {
    return {
      cookies: req.cookies,
      result: this.appService.getHello(),
    };
  }
}
