import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { FastifyReply } from 'fastify';
import { CreateUser } from '../../interfaces/user.interfaces';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    if ((await this.prisma.role.count()) === 0) {
      await this.prisma.role.createMany({
        data: ['system', 'admin', 'teacher', 'student'].map((name) => ({
          name,
        })),
      });
      console.log('User roles has been created!');
    }
  }

  async getRole(name: string) {
    return await this.prisma.role.findFirst({
      where: {
        name,
      },
    });
  }

  async getUser(email: string, username: string) {
    return await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
      include: {
        school: true,
      },
    });
  }

  async createUser(data: CreateUser) {
    return await this.prisma.user.create({
      data: { ...(data as User) },
    });
  }

  async createToken(user: object, res: FastifyReply) {
    const userKey = randomBytes(32).toString('hex');
    const token = await this.jwt.signAsync(user, {
      secret: userKey,
    });
    res.setCookie('userKey', userKey);

    return token;
  }
}
