import { Module } from '@nestjs/common';

import { BoardModule } from './board/board.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '@app/common/auth/jwt.strategy';
import { RefreshTokenGuard } from '@app/common/auth/refresh-token.guard';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    BoardModule,
    PrismaModule
  ],
  providers: []
})
export class AppModule { }