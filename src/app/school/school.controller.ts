import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { School, User } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthRequest } from '../../interfaces/auth.interface';
import { GetSchoolQuery } from '../../interfaces/school.interface';
import { ApiResponse } from '../../models/BaseResponse';
import { ZodPipe } from '../../shared/pipes/zod.pipe';
import {
  UpdateSchoolDto,
  updateSchoolSchemaDto,
} from '../../shared/pipes/zod/school.validation';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { SchoolService } from './school.service';

@Controller('school')
export class SchoolController {
  constructor(
    private service: SchoolService,
    private auth: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard(true))
  async getSchools(@Query() query: GetSchoolQuery, @Res() res: FastifyReply) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.getSchools(query),
      }),
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard(true))
  async selectSchool(
    @Param('id', ParseIntPipe) school_id: number,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    const data = await this.auth.updateUser(req.auth.user.id, {
      school_id,
    } as User);

    return res.status(201).send(
      new ApiResponse({
        data,
        message: 'School has been selected!',
        statusCode: 201,
      }),
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateSchool(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodPipe(updateSchoolSchemaDto)) dto: UpdateSchoolDto,
    @Req() req: FastifyRequest & AuthRequest,
    @Res() res: FastifyReply,
  ) {
    if (req.auth.user.role_id !== 1 && id !== req.auth.user.school_id)
      throw new ForbiddenException();

    const data = await this.service.updateSchool(id, dto as School);

    return res.status(201).send(
      new ApiResponse({
        data,
        message: 'School has been updated!',
        statusCode: 201,
      }),
    );
  }
}
