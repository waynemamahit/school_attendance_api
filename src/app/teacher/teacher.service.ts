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

  async getTeachers(school_id: number, query: GetTeacherQuery) {
    let where = {};
    if (Object.keys(query).length > 0) {
      const { id_number, name, email, username } = query;
      where = {
        OR: [
          { id_number },
          {
            user: { name },
          },
          {
            user: { email },
          },
          {
            user: { username },
          },
          {
            user: { username },
          },
        ],
        school_id,
      };
    }

    return await this.prisma.teacher.findMany({
      where,
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

  async showTeacher(school_id: number, id: number) {
    const data = await this.prisma.teacher.findFirst({
      where: {
        OR: [{ id }, { id_number: id.toString() }],
        user: {
          school_id,
        },
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
