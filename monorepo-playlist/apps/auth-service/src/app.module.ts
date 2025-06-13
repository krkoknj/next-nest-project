import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '@app/prisma';
import { RedisClientModule } from '@app/redis-client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RedisClientModule,
    PrismaModule,
    AuthModule,
  ]
})
export class AppModule { }
