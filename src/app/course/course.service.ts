import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  AddTeacherCourse,
  CreateCourse,
  GetCourseQuery,
  UpdateCourse,
} from '../../interfaces/course.interface';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async getCourses(class_ids: number[], query: GetCourseQuery) {
    const cond = Object.entries(query).map(
      ([key, value]: [string, string]) => ({
        [key]: value,
      }),
    );

    const filterClass = {
      AND: {
        class_id: {
          in: class_ids,
        },
      },
    };

    return await this.prisma.course.findMany({
      where:
        cond.length > 0
          ? {
              OR: cond,
              ...filterClass,
            }
          : filterClass,
    });
  }

  async createCourse(data: CreateCourse) {
    try {
      return await this.prisma.course.create({
        data,
      });
    } catch {
      throw new BadRequestException(`Admin could not create class!`);
    }
  }

  async addTeacherCourse({ teacher_id, course_id }: AddTeacherCourse) {
    try {
      return await this.prisma.teacherCourse.create({
        data: {
          teacher_id,
          course_id,
        },
        include: {
          teacher: true,
          course: true,
        },
      });
    } catch {
      throw new BadRequestException('Course for teacher has been exists!');
    }
  }

  async showCourse(
    { id, school_id }: { id: number; school_id: number },
    include: object = {},
  ) {
    try {
      return await this.prisma.course.findFirst({
        where: {
          id,
          school_class: { school_id },
        },
        include,
      });
    } catch {
      throw new HttpException('Class not found!', HttpStatus.NOT_FOUND);
    }
  }

  async updateCourseById(id: number, data: UpdateCourse) {
    try {
      return await this.prisma.course.update({
        where: { id },
        data,
      });
    } catch {
      throw new BadRequestException(`Teacher could not take more one class!`);
    }
  }

  async deleteCourse(id: number) {
    return await this.prisma.course.delete({
      where: { id },
    });
  }

  async deleteTeacherCourse(id: number, school_id: number) {
    return await this.prisma.teacherCourse.delete({
      where: {
        id,
        course: {
          school_class: {
            school_id,
          },
        },
      },
    });
  }
}
