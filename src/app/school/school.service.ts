import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSchool } from '../../interfaces/school.interface';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}

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
}
