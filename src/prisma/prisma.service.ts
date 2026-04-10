import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('PrismaService');

  constructor() {
    super();
  }

  async onModuleInit() {
    this.logger.log('Connecting to MongoDB database...');
    await this.$connect();
    this.logger.log('MongoDB database connected');
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from MongoDB database...');
    await this.$disconnect();
    this.logger.log('MongoDB database disconnected');
  }
}
