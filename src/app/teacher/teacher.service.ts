import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  CreateTeacher,
  GetTeacherQuery,
} from '../../interfaces/teacher.interface';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async getTeachers(query: GetTeacherQuery) {
    const cond = Object.entries(query).map(
      ([key, value]: [string, string]) => ({
        [key]: value,
      }),
    );

    return await this.prisma.class.findMany({
      where:
        cond.length > 0
          ? {
              OR: cond,
            }
          : {},
    });
  }

  async createTeacher(data: CreateTeacher) {
    try {
      const result = await this.prisma.teacher.create({
        data,
      });

      return result;
    } catch {
      throw new BadRequestException('ID Number or User has been exists!');
    }
  }

  async showTeacher(id: number) {
    const data = await this.prisma.teacher.findFirst({
      where: {
        OR: [{ id }, { id_number: id.toString() }],
      },
      include: {
        user: true,
      },
    });
    delete data.user.password;

    if (!data)
      throw new HttpException('Teacher not found!', HttpStatus.NOT_FOUND);

    return data;
  }

  async updateTeacherById(id: number, data: any) {
    try {
      return await this.prisma.teacher.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new BadRequestException('ID Number or User has been exists!');
    }
  }

  async deleteTeacher(id: number) {
    try {
      return await this.prisma.teacher.delete({
        where: { id },
        include: {
          user: true,
        },
      });
    } catch {
      throw new BadRequestException("Couldn't found delete teacher!");
    }
  }
}
