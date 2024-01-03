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
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthRequest } from '../../interfaces/auth.interface';
import {
  CreateSchedule,
  GetScheduleQuery,
  UpdateSchedule,
} from '../../interfaces/schedule.interface';
import { ApiResponse } from '../../models/BaseResponse';
import { ZodPipe } from '../../shared/pipes/zod.pipe';
import {
  ScheduleDto,
  scheduleSchemaDto,
} from '../../shared/pipes/zod/schedule.validation';
import { AbilityGuard } from '../ability/ability.guard';
import { AbilityService } from '../ability/ability.service';
import { AuthGuard } from '../auth/auth.guard';
import { CourseService } from '../course/course.service';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
@UseGuards(AuthGuard())
export class ScheduleController implements OnModuleInit {
  constructor(
    private ability: AbilityService,
    private service: ScheduleService,
    private course: CourseService,
  ) {}

  async onModuleInit() {
    await this.ability.init('schedule', [2]);
  }

  @Get()
  @UseGuards(AbilityGuard('schedule', 'get'))
  async getSchedules(
    @Query() query: GetScheduleQuery,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.getSchedules(req.auth.user.school_id, query),
      }),
    );
  }

  @Post()
  @UseGuards(AbilityGuard('schedule', 'create'))
  @UsePipes(new ZodPipe(scheduleSchemaDto))
  async createSchedule(
    @Body() dto: ScheduleDto,
    @Req()
    {
      auth: {
        user: { school_id },
      },
    }: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    await this.course.showCourse({ id: dto.course_id, school_id });

    const data = await this.service.createSchedule(dto as CreateSchedule);

    return res.status(201).send(
      new ApiResponse({
        data,
        message: 'Schedule has been created!',
        statusCode: 201,
      }),
    );
  }

  @Get(':id')
  @UseGuards(AbilityGuard('schedule', 'show'))
  async showSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.showSchedule({
          id,
          school_id: req.auth.user.school_id,
        }),
      }),
    );
  }

  @Put(':id')
  @UseGuards(AbilityGuard('schedule', 'update'))
  async updateSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodPipe(scheduleSchemaDto)) dto: ScheduleDto,
    @Req()
    req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    await this.course.showCourse({
      id: dto.course_id,
      school_id: req.auth.user.school_id,
    });

    const data = await this.service.updateSchedule(id, dto as UpdateSchedule);

    return res.status(201).send(
      new ApiResponse({
        data,
        message: 'Schedule has been updated!',
        statusCode: 201,
      }),
    );
  }

  @Delete(':id')
  @UseGuards(AbilityGuard('schedule', 'delete'))
  async deleteSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    await this.course.showCourse({ id, school_id: req.auth.user.school_id });

    const data = await this.service.deleteSchedule(id);

    return res.status(200).send(
      new ApiResponse({
        data,
        message: 'Schedule has been deleted!',
      }),
    );
  }
}
