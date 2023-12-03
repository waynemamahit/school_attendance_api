import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Put,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { FastifyReply } from 'fastify';
import { ApiResponse } from '../../models/BaseResponse';
import { ZodPipe } from '../../shared/pipes/zod.pipe';
import {
  LoginDto,
  RegisterDto,
  loginSchemaDto,
  registerSchemaDto,
} from '../../shared/pipes/zod/auth.validation';
import { SchoolService } from '../school/school.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private service: AuthService,
    private schoolService: SchoolService,
  ) {}

  @Post('login')
  @UsePipes(new ZodPipe(loginSchemaDto))
  async login(@Body() { email, password }: LoginDto, @Res() res: FastifyReply) {
    const user = await this.service.getUser(email, email.split('@')[0]);
    if (!compareSync(password, user?.password ?? ''))
      throw new UnauthorizedException();
    delete user.password;

    const token = await this.service.createToken(user, res);

    return res.status(200).send(
      new ApiResponse({
        data: {
          user,
          token,
        },
        message: 'Login Succesfully',
      }),
    );
  }

  @Put('register')
  @UsePipes(new ZodPipe(registerSchemaDto))
  async register(
    @Body() { school, user }: RegisterDto,
    @Res() res: FastifyReply,
  ) {
    const checkUser = await this.service.getUser(user.email, user.username);
    if (checkUser) throw new BadRequestException('User has been exists!');

    user.password = hashSync(user.password, genSaltSync(12));
    const newUser = await this.service.createUser({
      ...(user as User),
      role_id: (await this.service.getRole('admin')).id,
      school_id: (await this.schoolService.createSchool(school as never)).id,
    });
    delete newUser.password;

    const token = await this.service.createToken(newUser, res);
    // send email

    return res.status(201).send(
      new ApiResponse({
        data: {
          user: newUser,
          token,
        },
        message: 'Register Successfully!',
        statusCode: 201,
      }),
    );
  }
}
