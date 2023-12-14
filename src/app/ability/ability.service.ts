import { BadRequestException, Injectable } from '@nestjs/common';
import { RoleAbility } from '@prisma/client';
import { GetAbilityQuery } from 'src/interfaces/ability.interface';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class AbilityService {
  constructor(private prisma: PrismaService) {}

  async init(name: string, role_ids: number[]) {
    const ability_ids = (
      await this.prisma.ability.findMany({
        select: {
          id: true,
        },
        where: {
          name,
        },
      })
    ).map(({ id }) => id);

    if (
      (await this.prisma.roleAbility.count({
        where: {
          role_id: {
            in: role_ids,
          },
          ability_id: {
            in: ability_ids ?? [],
          },
        },
      })) === 0
    ) {
      for (const role_id of role_ids) {
        await this.prisma.roleAbility.createMany({
          data: ability_ids.map((ability_id) => ({
            ability_id,
            role_id,
          })),
        });
      }
      console.log(name + ' feature ability has been created!');
    }
  }

  async getRoleAbilities(where: {
    role_id: number;
    ability: {
      name: string;
      action: string;
    };
  }) {
    return await this.prisma.roleAbility.findMany({
      where,
    });
  }

  async getAbilities(query: GetAbilityQuery) {
    const cond = Object.entries(query).map(
      ([key, value]: [string, string]) => ({
        [key]: value,
      }),
    );

    return await this.prisma.ability.findMany({
      where:
        cond.length > 0
          ? {
              OR: cond,
            }
          : {},
    });
  }

  async getRoles() {
    return await this.prisma.role.findMany({});
  }

  async createAbility(data: RoleAbility) {
    try {
      await this.prisma.ability.findFirstOrThrow({
        where: { id: data.ability_id },
      });
      await this.prisma.role.findFirstOrThrow({
        where: { id: data.role_id },
      });

      return await this.prisma.roleAbility.create({
        data,
      });
    } catch {
      throw new BadRequestException('Ability and role has been exists!');
    }
  }

  async deleteAbility(id: number) {
    try {
      return await this.prisma.roleAbility.delete({
        where: { id },
        include: {
          ability: true,
          role: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Ability has been deleted or not found!');
    }
  }
}
