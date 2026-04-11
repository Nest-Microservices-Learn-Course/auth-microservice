import { Injectable } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';

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
        data: { email, password, name },
      });

      console.log({ user: newUser });
      return { user: newUser, token: 'abc' };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: (error as Error).message,
      });
    }
  }

  loginUser(payload: LoginUserDto) {
    return payload;
  }

  verifyUser() {
    return 'verify user token';
  }
}
