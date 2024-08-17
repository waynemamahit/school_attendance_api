import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  CreateSchedule,
  GetScheduleQuery,
  UpdateSchedule,
} from '../../interfaces/schedule.interface';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async getSchedules(school_id: number, query: GetScheduleQuery) {
    const cond = Object.entries(query).map(
      ([key, value]: [string, string]) => ({
        [key]: value,
      }),
    );

    return await this.prisma.schedule.findMany({
      where:
        cond.length > 0
          ? {
              OR: cond,
              course: {
                school_class: {
                  school_id,
                },
              },
            }
          : {},
    });
  }

  async createSchedule(data: CreateSchedule) {
    try {
      return await this.prisma.schedule.create({
        data,
        include: {
          course: true,
        },
      });
    } catch {
      throw new BadRequestException(
        `Could create schedule with day and course equal!`,
      );
    }
  }

  async showSchedule({ id, school_id }: { id: number; school_id: number }) {
    try {
      return await this.prisma.schedule.findFirst({
        where: {
          id,
          course: {
            school_class: { school_id },
          },
        },
        include: {
          course: true,
        },
      });
    } catch {
      throw new HttpException('Schedule not found!', HttpStatus.NOT_FOUND);
    }
  }

  async updateSchedule(id: number, data: UpdateSchedule) {
    try {
      return await this.prisma.schedule.update({
        where: { id },
        data,
      });
    } catch {
      throw new BadRequestException(
        `Could update schedule with day and course equal!`,
      );
    }
  }

  async deleteSchedule(id: number) {
    return await this.prisma.schedule.delete({
      where: { id },
    });
  }
}
