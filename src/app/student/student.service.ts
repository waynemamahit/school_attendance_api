import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Student } from '@prisma/client';
import {
  CreateStudent,
  GetStudentQuery,
} from '../../interfaces/student.interface';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getStudents(school_id: number, query: GetStudentQuery) {
    let where = {};
    if (Object.keys(query).length > 0) {
      const { name, email, username, id_number, className } = query;
      where = {
        OR: [
          { id_number },
          { user: { name } },
          { user: { email } },
          { user: { username } },
          { user: { school_id } },
          {
            school_class: {
              name: className,
            },
          },
        ],
      };
    }

    return await this.prisma.student.findMany({ where });
  }

  async createStudent(data: CreateStudent) {
    try {
      const result = await this.prisma.student.create({
        data,
        include: {
          user: true,
        },
      });
      delete result.user.password;

      return result;
    } catch {
      throw new BadRequestException('ID Number or User has been exists!');
    }
  }

  async showStudent(school_id: number, id: number) {
    const data = await this.prisma.student.findFirst({
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
      throw new HttpException('Student not found!', HttpStatus.NOT_FOUND);

    return data;
  }

  async updateStudentById(id: number, data: Student) {
    try {
      const student = await this.prisma.student.update({
        where: { id },
        data,
        include: {
          user: true,
        },
      });
      delete student.user.password;

      return student;
    } catch {
      throw new BadRequestException('ID Number or User has been exists!');
    }
  }

  async deleteStudent(id: number) {
    try {
      const student = await this.prisma.student.delete({
        where: { id },
        include: {
          user: true,
        },
      });
      delete student.user.password;

      return student;
    } catch {
      throw new BadRequestException("Couldn't found delete student!");
    }
  }
}
