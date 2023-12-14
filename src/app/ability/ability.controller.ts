import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RoleAbility } from '@prisma/client';
import { FastifyReply } from 'fastify';
import {
  GetAbilityQuery,
  GetRoleAbilityQuery,
} from '../../interfaces/ability.interface';
import { ApiResponse } from '../../models/BaseResponse';
import { ZodPipe } from '../../shared/pipes/zod.pipe';
import {
  CreateAbilityDto,
  createAbilitySchemaDto,
} from '../../shared/pipes/zod/ability.validation';
import { AuthGuard } from '../auth/auth.guard';
import { AbilityService } from './ability.service';

@Controller()
@UseGuards(AuthGuard(true))
export class AbilityController {
  constructor(private service: AbilityService) {}

  @Get('ability')
  async getAbilities(
    @Query() query: GetAbilityQuery,
    @Res() res: FastifyReply,
  ) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.getAbilities(query),
        message: 'OK',
      }),
    );
  }

  @Get('role')
  async getRoles(@Res() res: FastifyReply) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.getRoles(),
        message: 'OK',
      }),
    );
  }

  @Get('ability/role')
  async getRoleAbilities(
    @Query() { name, action, role_id }: GetRoleAbilityQuery,
    @Res() res: FastifyReply,
  ) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.getRoleAbilities({
          role_id,
          ability: {
            name,
            action,
          },
        }),
        message: 'OK',
      }),
    );
  }

  @Post('ability/role')
  async createAbilities(
    @Body(new ZodPipe(createAbilitySchemaDto)) dto: CreateAbilityDto,
    @Res() res: FastifyReply,
  ) {
    const data = await this.service.createAbility(dto as RoleAbility);

    return res.status(201).send(
      new ApiResponse({
        data,
        message: 'Ability has been created!',
        statusCode: 201,
      }),
    );
  }

  @Delete('ability/role/:id')
  async deleteAbility(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: FastifyReply,
  ) {
    return res.status(200).send(
      new ApiResponse({
        data: await this.service.deleteAbility(id),
        message: 'Ability has been removed!',
      }),
    );
  }
}
