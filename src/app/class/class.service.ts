import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  CreateClass,
  GetClassQuery,
  UpdateClass,
} from '../../interfaces/class.interfaces';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async getClasses(query: GetClassQuery) {
    return await this.prisma.class.findMany({
      where: {
        OR: Object.entries(query).map(([key, value]: [string, string]) => ({
          [key]: value,
        })),
      },
    });
  }

  async showClass(where: { id: number; school_id: number }) {
    try {
      return await this.prisma.class.findFirst({
        where,
      });
    } catch {
      throw new HttpException('Class not found!', HttpStatus.NOT_FOUND);
    }
  }

  async createClass(data: CreateClass) {
    try {
      return await this.prisma.class.create({
        data,
      });
    } catch (error) {
      throw new BadRequestException(`Teacher could not take more one class!`);
    }
  }

  async updateClassById(id: number, data: UpdateClass) {
    try {
      return await this.prisma.class.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new BadRequestException(`Teacher could not take more one class!`);
    }
  }

  async deleteClass(id: number) {
    return await this.prisma.class.delete({
      where: { id },
    });
  }
}
