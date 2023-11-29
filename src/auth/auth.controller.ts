import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodPipe } from '../shared/pipes/zod.pipe';
import { LoginDto, loginSchemaDto } from '../shared/pipes/zod/auth.validation';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UsePipes(new ZodPipe(loginSchemaDto))
  login(@Body() dto: LoginDto) {
    return {
      dto,
      result: 'Hello World!',
    };
  }
}
