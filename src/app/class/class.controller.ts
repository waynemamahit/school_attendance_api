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
import { AbilityGuard } from '../ability/ability.guard';
import { AbilityService } from '../ability/ability.service';
import { AuthGuard } from '../auth/auth.guard';
import { TeacherService } from '../teacher/teacher.service';
import { ClassService } from './class.service';

@Controller('class')
@UseGuards(AuthGuard())
export class ClassController implements OnModuleInit {
  constructor(
    private service: ClassService,
    private teacherService: TeacherService,
    private ability: AbilityService,
  ) {}

  async onModuleInit() {
    await this.ability.init('class', [2]);
  }

  @Get()
  @UseGuards(AbilityGuard('class', 'get'))
  async getClasses(
    @Query() query: GetClassQuery,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.getClasses(req.auth.user.school_id, query),
      }),
    );
  }

  @Post()
  @UseGuards(AbilityGuard('class', 'create'))
  @UsePipes(new ZodPipe(classSchemaDto))
  async createClass(
    @Body() dto: ClassDto,
    @Req()
    {
      auth: {
        user: { school_id },
      },
    }: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    await this.teacherService.showTeacher(school_id, dto.teacher_id);
    const data = await this.service.createClass({
      ...(dto as Class),
      school_id,
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
  @UseGuards(AbilityGuard('class', 'show'))
  async showClass(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.showClass({
          id,
          school_id: req.auth.user.school_id,
        }),
        message: 'OK',
      }),
    );
  }

  @Put(':id')
  @UseGuards(AbilityGuard('class', 'update'))
  async updateClass(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodPipe(classSchemaDto)) dto: ClassDto,
    @Req()
    {
      auth: {
        user: { school_id },
      },
    }: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    await this.teacherService.showTeacher(school_id, dto.teacher_id);

    const data = await this.service.updateClassById(id, {
      ...dto,
      school_id,
    } as Class);

    return res.status(201).send(
      new ApiResponse({
        data,
        message: 'Class has been updated!',
        statusCode: 201,
      }),
    );
  }

  @Delete(':id')
  @UseGuards(AbilityGuard('class', 'delete'))
  async deleteClass(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    await this.service.showClass({
      id,
      school_id: req.auth.user.school_id,
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
