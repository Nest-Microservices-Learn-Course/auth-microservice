import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  registerUser(@Payload() payload: RegisterUserDto) {
    return this.authService.registerUser(payload);
  }

  @MessagePattern('auth.login.user')
  loginUser(@Payload() payload: LoginUserDto) {
    return this.authService.loginUser(payload);
  }
  @MessagePattern('auth.verify.user')
  verifyUser(@Payload() token: string) {
    return this.authService.verifyUser(token);
  }
}
