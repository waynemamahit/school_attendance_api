import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiResponse } from '../../models/BaseResponse';
import { ZodPipe } from '../../shared/pipes/zod.pipe';
import {
  LoginDto,
  loginSchemaDto,
} from '../../shared/pipes/zod/auth.validation';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  @UsePipes(new ZodPipe(loginSchemaDto))
  login(@Body() { email, password }: LoginDto) {
    return new ApiResponse({
      data: { email, password },
      message: 'Login succesfully',
    });
  }
}
