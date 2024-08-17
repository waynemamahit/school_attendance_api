import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  CreateSchool,
  GetSchoolQuery,
} from '../../interfaces/school.interface';
import { PrismaService } from '../../shared/services/prisma.service';
import { School } from '@prisma/client';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}

  async getSchools(query: GetSchoolQuery) {
    const cond = Object.entries(query).map(
      ([key, value]: [string, string]) => ({
        [key]: value,
      }),
    );

    return await this.prisma.school.findMany({
      where:
        cond.length > 0
          ? {
              OR: cond,
            }
          : {},
    });
  }

  async showSchool(id: number) {
    try {
      return await this.prisma.school.findFirst({
        where: { id },
      });
    } catch {
      throw new HttpException('School not found!', HttpStatus.NOT_FOUND);
    }
  }

  async createSchool(data: CreateSchool) {
    try {
      return await this.prisma.school.create({
        data: { ...(data as any) },
      });
    } catch {
      throw new BadRequestException(
        'School name has been exists or parameters invalid!',
      );
    }
  }

  async updateSchool(id: number, data: School) {
    try {
      return await this.prisma.school.update({
        where: { id },
        data,
      });
    } catch {
      throw new BadRequestException(
        'School name has been exists or parameters invalid!',
      );
    }
  }
}
