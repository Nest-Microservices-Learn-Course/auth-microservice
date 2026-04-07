import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
// import { Inject } from '@nestjs/common';
// import { NATS_SERVICE } from 'src/config';
// import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(
    // @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern('auth.register.user')
  registerUser() {
    return this.authService.registerUser();
  }

  @MessagePattern('auth.login.user')
  loginUser() {
    return this.authService.loginUser();
  }
  @MessagePattern('auth.verify.user')
  verifyUser() {
    return this.authService.verifyUser();
  }
}
