import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { randomBytes } from 'crypto';
import { FastifyReply } from 'fastify';
import { CreateUser } from '../../interfaces/user.interface';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    if ((await this.prisma?.role?.count()) === 0) {
      try {
        await this.prisma.role.createMany({
          data: ['system', 'admin', 'teacher', 'student'].map((name) => ({
            name,
          })),
        });
        console.log('user roles has been created!');
      } catch {
        console.log('user role has name has been exists!');
      }
    }

    if ((await this.prisma.ability.count()) === 0) {
      for (const feature of [
        'absent',
        'class',
        'course',
        'schedule',
        'school',
        'student',
        'teacher',
      ]) {
        try {
          await this.prisma.ability.createMany({
            data: ['get', 'show', 'create', 'update', 'delete'].map(
              (action) => ({
                name: feature,
                action,
              }),
            ),
          });
        } catch {
          console.log('ability has been exists!');
          continue;
        }
      }
      console.log('user abilities has been created!');
    }

    if (
      !(await this.prisma.user.findFirst({
        where: {
          role_id: 1,
        },
      }))
    ) {
      try {
        await this.prisma.user.create({
          data: {
            name: 'Super Administrator',
            email: 'suadmin@mail.com',
            username: 'suadmin',
            password: hashSync('password12345', genSaltSync(12)),
            role_id: 1,
          },
        });
        console.log('Super Admin has been created!');
      } catch {
        console.log('Super Admin has been exists!');
      }
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
        teacher: true,
        student: true,
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

  async createToken(user: User, res: FastifyReply) {
    const userKey = randomBytes(32).toString('hex');
    const token = await this.jwt.signAsync(user, {
      secret: userKey,
    });
    res.setCookie('userKey', userKey);

    return token;
  }

  async getUserToken(token: string, secret: string) {
    if (typeof token === 'undefined') throw new UnauthorizedException();
    return await this.jwt.verifyAsync(token, { secret });
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

  async deleteUser(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException('Could not delete user!');
    }
  }
}
