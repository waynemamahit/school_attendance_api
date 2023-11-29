import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateUser } from 'src/interfaces/user.interfaces';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUser) {
    return this.prisma.user.create({
      data: {
        ...data,
      },
    });
  }
}
