import {
  Body,
  Controller,
  Delete,
  Get,
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
import { Class } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthRequest } from '../../interfaces/auth.interface';
import { GetClassQuery } from '../../interfaces/class.interfaces';
import { ApiResponse } from '../../models/BaseResponse';
import { ZodPipe } from '../../shared/pipes/zod.pipe';
import {
  ClassDto,
  classSchemaDto,
} from '../../shared/pipes/zod/class.validation';
import { AuthRoleGuard } from '../auth/auth-role.guard';
import { AuthGuard } from '../auth/auth.guard';
import { TeacherService } from '../teacher/teacher.service';
import { ClassService } from './class.service';

@Controller('class')
@UseGuards(AuthGuard)
@UseGuards(AuthRoleGuard(1, 2))
export class ClassController {
  constructor(
    private service: ClassService,
    private teacherService: TeacherService,
  ) {}

  @Get()
  async getClasses(@Query() query: GetClassQuery, @Res() res: FastifyReply) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.getClasses(query),
      }),
    );
  }

  @Post()
  @UsePipes(new ZodPipe(classSchemaDto))
  async createClass(
    @Body() dto: ClassDto,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    await this.teacherService.showTeacher(dto.teacher_id);
    const data = await this.service.createClass({
      ...(dto as Class),
      school_id: req.auth.user.school_id,
    });

    return res.status(201).send(
      new ApiResponse({
        data,
        message: 'Class has been created!',
        statusCode: 201,
      }),
    );
  }

  @Get(':id')
  async showClass(
    @Param('id', ParseIntPipe) id: number,
    @Req()
    {
      auth: {
        user: { school_id },
      },
    }: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.showClass({
          id,
          school_id,
        }),
        message: 'OK',
      }),
    );
  }

  @Put(':id')
  async updateClass(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodPipe(classSchemaDto)) dto: ClassDto,
    @Res() res: FastifyReply,
  ) {
    await this.teacherService.showTeacher(dto.teacher_id);
    const data = await this.service.updateClassById(id, dto as Class);

    return res.status(201).send(
      new ApiResponse({
        data,
        message: 'Class has been updated!',
        statusCode: 201,
      }),
    );
  }

  @Delete(':id')
  async deleteClass(
    @Param('id', ParseIntPipe) id: number,
    @Req()
    {
      auth: {
        user: { school_id },
      },
    }: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    await this.service.showClass({
      id,
      school_id,
    });
    const data = await this.service.deleteClass(id);

    return res.status(200).send(
      new ApiResponse({
        data,
        message: 'Class has been deleted!',
      }),
    );
  }
}
