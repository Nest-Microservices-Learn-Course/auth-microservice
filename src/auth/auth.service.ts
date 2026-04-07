import { Injectable } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  registerUser(payload: RegisterUserDto) {
    return payload;
  }

  loginUser(payload: LoginUserDto) {
    return payload;
  }

  verifyUser() {
    return 'verify user token';
  }
}
