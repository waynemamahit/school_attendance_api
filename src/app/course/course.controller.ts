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
import { GetClassQuery } from 'src/interfaces/class.interfaces';
import { AuthRequest } from '../../interfaces/auth.interface';
import {
  AddTeacherCourse,
  CreateCourse,
  GetCourseQuery,
  UpdateCourse,
} from '../../interfaces/course.interface';
import { ApiResponse } from '../../models/BaseResponse';
import { ZodPipe } from '../../shared/pipes/zod.pipe';
import {
  CourseDto,
  CourseTeacherDto,
  courseSchemaDto,
  courseTeacherSchemaDto,
} from '../../shared/pipes/zod/course.validation';
import { AbilityGuard } from '../ability/ability.guard';
import { AbilityService } from '../ability/ability.service';
import { AuthGuard } from '../auth/auth.guard';
import { ClassService } from '../class/class.service';
import { CourseService } from './course.service';

@Controller('course')
@UseGuards(AuthGuard())
export class CourseController implements OnModuleInit {
  constructor(
    private service: CourseService,
    private ability: AbilityService,
    private classService: ClassService,
  ) {}

  async onModuleInit() {
    await this.ability.init('course', [2]);
  }

  @Get()
  @UseGuards(AbilityGuard('course', 'get'))
  async getCourses(
    @Query() query: GetCourseQuery,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    const classes = await this.classService.getClasses(
      req.auth.user.school_id,
      {} as GetClassQuery,
    );

    return res.status(200).send(
      new ApiResponse({
        data: await this.service.getCourses(
          classes.map((classItem) => classItem.id),
          query,
        ),
      }),
    );
  }

  @Post()
  @UseGuards(AbilityGuard('course', 'create'))
  @UsePipes(new ZodPipe(courseSchemaDto))
  async createCourse(
    @Body() dto: CourseDto,
    @Req()
    {
      auth: {
        user: { school_id },
      },
    }: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    await this.classService.showClass({
      id: dto.class_id,
      school_id,
    });

    const data = await this.service.createCourse(dto as CreateCourse);

    return res.status(201).send(
      new ApiResponse({
        data,
        message: 'Class has been created!',
        statusCode: 201,
      }),
    );
  }

  @Post('teacher')
  @UseGuards(AbilityGuard('course', 'create'))
  @UsePipes(new ZodPipe(courseTeacherSchemaDto))
  async addTeacherCourse(
    @Body() dto: CourseTeacherDto,
    @Req()
    {
      auth: {
        user: { school_id },
      },
    }: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    await this.service.showCourse({
      id: dto.course_id,
      school_id,
    });

    const data = await this.service.addTeacherCourse(dto as AddTeacherCourse);

    return res.status(201).send(
      new ApiResponse({
        data,
        message: 'Class has been created!',
        statusCode: 201,
      }),
    );
  }

  @Get(':id')
  @UseGuards(AbilityGuard('course', 'show'))
  async showClass(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.showCourse(
          {
            id,
            school_id: req.auth.user.school_id,
          },
          {
            teachers: true,
          },
        ),
        message: 'OK',
      }),
    );
  }

  @Put(':id')
  @UseGuards(AbilityGuard('course', 'update'))
  async updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodPipe(courseSchemaDto)) dto: CourseDto,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    await this.service.showCourse({ id, school_id: req.auth.user.school_id });

    const data = await this.service.updateCourseById(id, dto as UpdateCourse);

    return res.status(201).send(
      new ApiResponse({
        data,
        message: 'Course has been updated!',
        statusCode: 201,
      }),
    );
  }

  @Delete('teacher/:id')
  @UseGuards(AbilityGuard('course', 'delete'))
  async deleteTeacherCourse(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.deleteTeacherCourse(
          id,
          req.auth.user.school_id,
        ),
        message: 'Course for teacher has been deleted!',
      }),
    );
  }

  @Delete(':id')
  @UseGuards(AbilityGuard('course', 'delete'))
  async deleteCourse(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    await this.service.showCourse({ id, school_id: req.auth.user.school_id });
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.deleteCourse(id),
        message: 'Course has been deleted!',
      }),
    );
  }
}
