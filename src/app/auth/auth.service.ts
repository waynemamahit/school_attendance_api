import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(username: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        AND: [
          {
            email: {
              contains: username,
            },
          },
          {
            username,
          },
        ],
      },
    });

    if (!compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials!');

    return user;
  }
}
