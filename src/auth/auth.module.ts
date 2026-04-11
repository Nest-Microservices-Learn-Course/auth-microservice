import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { NatsModule } from '../transports/nats.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../config/envs';

@Module({
  // imports: [NatsModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: {
        expiresIn: '2h',
      },
    }),
  ],
})
export class AuthModule {}
