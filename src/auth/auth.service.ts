import { Injectable } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async registerUser(payload: RegisterUserDto) {
    const user = await this.prisma.user.findMany();
    console.log({ user });
    return payload;
  }

  loginUser(payload: LoginUserDto) {
    return payload;
  }

  verifyUser() {
    return 'verify user token';
  }
}
