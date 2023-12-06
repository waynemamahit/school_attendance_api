import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
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

  async createUser(user: CreateUser) {
    try {
      user.password = hashSync(user.password, genSaltSync(12));
      const newUser = await this.prisma.user.create({
        data: user as User,
      });
      delete newUser.password;

      return newUser;
    } catch {
      throw new BadRequestException('Username or email has been exists!');
    }
  }

  async createToken(user: object, res: FastifyReply) {
    const userKey = randomBytes(32).toString('hex');
    const token = await this.jwt.signAsync(user, {
      secret: userKey,
    });
    res.setCookie('userKey', userKey);

    return token;
  }

  async updateUser(id: number, data: User) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch {
      throw new BadRequestException('Username or email has been exists!');
    }
  }
}
