import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  registerUser() {
    return 'register user';
  }

  loginUser() {
    return 'login user';
  }

  verifyUser() {
    return 'verify user token';
  }
}
