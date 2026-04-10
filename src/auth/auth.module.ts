import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NatsModule } from '../transports/nats.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [NatsModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
