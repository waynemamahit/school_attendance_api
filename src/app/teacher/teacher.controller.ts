import {
  Body,
  Controller,
  Delete,
  Get,
  OnModuleInit,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthRequest } from '../../interfaces/auth.interface';
import { GetTeacherQuery } from '../../interfaces/teacher.interface';
import { ApiResponse } from '../../models/BaseResponse';
import { ZodPipe } from '../../shared/pipes/zod.pipe';
import {
  CreateTeacherDto,
  UpdateTeacherDto,
  createTeacherSchemaDto,
  updateTeacherSchemaDto,
} from '../../shared/pipes/zod/teacher.validation';
import { AbilityGuard } from '../ability/ability.guard';
import { AbilityService } from '../ability/ability.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { TeacherService } from './teacher.service';

@Controller('teacher')
@UseGuards(AuthGuard())
export class TeacherController implements OnModuleInit {
  constructor(
    private service: TeacherService,
    private authService: AuthService,
    private ability: AbilityService,
  ) {}

  async onModuleInit() {
    await this.ability.init('teacher', [2]);
  }

  @Get()
  @UseGuards(AbilityGuard('teacher', 'get'))
  async getTeacher(@Query() query: GetTeacherQuery, @Res() res: FastifyReply) {
    const data = await this.service.getTeachers(query);

    return res.status(200).send(
      new ApiResponse({
        data,
        message: 'OK',
      }),
    );
  }

  @Post()
  @UseGuards(AbilityGuard('teacher', 'create'))
  @UsePipes(new ZodPipe(createTeacherSchemaDto))
  async createTeacher(
    @Req() req: FastifyRequest & AuthRequest,
    @Body() dto: CreateTeacherDto,
    @Res() res: FastifyReply,
  ) {
    const password = dto?.password ?? randomBytes(8).toString('hex');
    const newUser = await this.authService.createUser({
      name: dto.name,
      email: dto.email,
      username: dto.username,
      password,
      role_id: 3,
      school_id: req.auth.user.school_id,
    });

    const newTeacher = await this.service.createTeacher({
      id_number: dto.id_number,
      user_id: newUser.id,
    });
    // send email

    return res.status(201).send(
      new ApiResponse({
        data: newTeacher,
        message: 'Teacher has been created!',
        statusCode: 201,
      }),
    );
  }

  @Get(':id')
  @UseGuards(AbilityGuard('teacher', 'show'))
  async showTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: FastifyReply,
  ) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.showTeacher(id),
        message: 'OK',
      }),
    );
  }

  @Put(':id')
  @UseGuards(AbilityGuard('teacher', 'update'))
  async updateTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodPipe(updateTeacherSchemaDto)) dto: UpdateTeacherDto,
    @Res() res: FastifyReply,
  ) {
    const teacher = await this.service.showTeacher(id);

    await this.authService.updateUser(teacher.user_id, {
      name: dto.name,
      username: dto.username,
      email: dto.email,
    } as User);

    const data = await this.service.updateTeacherById(id, {
      id_number: dto.id_number,
    });

    return res.status(201).send(
      new ApiResponse({
        data,
        message: 'Teacher has been updated!',
        statusCode: 201,
      }),
    );
  }

  @Delete(':id')
  @UseGuards(AbilityGuard('teacher', 'delete'))
  async deleteTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: FastifyReply,
  ) {
    const data = await this.service.deleteTeacher(id);

    return res.status(200).send(
      new ApiResponse({
        data,
        message: 'Teacher has been deleted!',
        statusCode: 200,
      }),
    );
  }
}
