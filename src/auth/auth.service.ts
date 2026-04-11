import { Injectable } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async registerUser(payload: RegisterUserDto) {
    const { email, name, password } = payload;
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new RpcException({
          status: 400,
          message: 'User already exists',
        });
      }

      const newUser = await this.prisma.user.create({
        data: { email, name, password: bcrypt.hashSync(password, 10) },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...user } = newUser;

      return { user, token: 'abc' };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: (error as Error).message,
      });
    }
  }

  async loginUser(payload: LoginUserDto) {
    const { email, password } = payload;
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        throw new RpcException({
          status: 400,
          message: 'invalid credentials',
        });
      }

      const isPasswordValid = bcrypt.compareSync(
        password,
        existingUser.password,
      );
      if (!isPasswordValid) {
        throw new RpcException({
          status: 400,
          message: 'invalid credentials',
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...user } = existingUser;

      return { user, token: 'abc' };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: (error as Error).message,
      });
    }
  }

  verifyUser() {
    return 'verify user token';
  }
}
