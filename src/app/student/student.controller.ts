import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { Student, User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { object } from 'zod';
import { AuthRequest } from '../../interfaces/auth.interface';
import { GetStudentQuery } from '../../interfaces/student.interface';
import { ApiResponse } from '../../models/BaseResponse';
import { ZodPipe } from '../../shared/pipes/zod.pipe';
import {
  StudentDto,
  studentSchemaDto,
} from '../../shared/pipes/zod/student.validation';
import { AbilityGuard } from '../ability/ability.guard';
import { AbilityService } from '../ability/ability.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { ClassService } from '../class/class.service';
import { SchoolService } from '../school/school.service';
import { StudentService } from './student.service';

@Controller('student')
@UseGuards(AuthGuard())
export class StudentController {
  constructor(
    private service: StudentService,
    private auth: AuthService,
    private ability: AbilityService,
    private classService: ClassService,
    private school: SchoolService,
  ) {}

  async onModuleInit() {
    await this.ability.init('student', [2, 3]);
  }

  @Get()
  @UseGuards(AbilityGuard('student', 'get'))
  async getStudents(
    @Query() query: GetStudentQuery,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    const data = await this.service.getStudents(req.auth.user.school_id, query);

    return res.status(200).send(
      new ApiResponse({
        data,
        message: 'OK',
      }),
    );
  }

  @Post()
  @UseGuards(AbilityGuard('student', 'create'))
  @UsePipes(new ZodPipe(studentSchemaDto))
  async createStudent(
    @Req()
    {
      auth: {
        user: { school_id, role_id, email, username },
      },
    }: FastifyRequest & AuthRequest,
    @Body() dto: StudentDto,
    @Res() res: FastifyReply,
  ) {
    await this.school.showSchool(school_id);

    const schoolClass = await this.classService.showClass({
      id: dto.class_id,
      school_id,
    });

    if (role_id === 3) {
      const user = await this.auth.getUser(email, username);
      if (schoolClass.teacher_id !== user.teacher.id)
        throw new ForbiddenException(
          'Teacher has not authority to create student on another class',
        );
    }

    const password = dto?.password ?? randomBytes(8).toString('hex');
    const newUser = await this.auth.createUser({
      name: dto.name,
      email: dto.email,
      username: dto.username,
      password,
      role_id: 4,
      school_id,
    });

    const newStudent = await this.service.createStudent({
      id_number: dto.id_number,
      class_id: dto.class_id,
      user_id: newUser.id,
    });
    // send email

    return res.status(201).send(
      new ApiResponse({
        data: newStudent,
        message: 'Student has been created!',
        statusCode: 201,
      }),
    );
  }

  @Get(':id')
  @UseGuards(AbilityGuard('student', 'show'))
  async showStudent(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.showStudent(req.auth.user.school_id, id),
        message: 'OK',
      }),
    );
  }

  @Put(':id')
  @UseGuards(AbilityGuard('student', 'update'))
  async updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodPipe(studentSchemaDto)) dto: StudentDto,
    @Req()
    {
      auth: {
        user: { school_id, role_id, email, username },
      },
    }: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    const student = await this.service.showStudent(school_id, id);

    const schoolClass = await this.classService.showClass({
      id: dto.class_id,
      school_id,
    });

    if (role_id === 3) {
      const user = await this.auth.getUser(email, username);
      if (schoolClass.teacher_id !== user.teacher.id)
        throw new ForbiddenException(
          'Teacher has not authority to create student on class',
        );
    }

    const user = await this.auth.updateUser(student.user_id, {
      name: dto.name,
      username: dto.username,
      email: dto.email,
    } as User);

    const data = await this.service.updateStudentById(id, {
      id_number: dto.id_number,
      class_id: dto.class_id,
      user_id: user.id,
    } as Student);

    return res.status(201).send(
      new ApiResponse({
        data,
        message: 'Student has been updated!',
        statusCode: 201,
      }),
    );
  }

  @Delete(':id')
  @UseGuards(AbilityGuard('student', 'delete'))
  async deleteTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Req()
    {
      auth: {
        user: { email, username, role_id, school_id },
      },
    }: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    const data = await this.service.showStudent(school_id, id);
    const classes = await this.classService.getClasses(school_id, object);
    if (!classes.map((item) => item.id).includes(data.class_id))
      throw new ForbiddenException(
        'Could not delete student on another school',
      );

    if (role_id !== 2) {
      const classItem = await this.classService.showClass({
        id: data.class_id,
        school_id,
      });
      const user = await this.auth.getUser(email, username);
      if (classItem.teacher_id !== user.teacher.id)
        throw new ForbiddenException(
          'Could not delete student on another class',
        );
    }
    await this.auth.deleteUser(data.user_id);

    return res.status(200).send(
      new ApiResponse({
        data,
        message: 'Student has been deleted!',
        statusCode: 200,
      }),
    );
  }
}
