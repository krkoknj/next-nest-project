import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@app/common/jwt/constants';
import { PrismaModule } from '@app/prisma';
import { JwtStrategy } from '@app/common/auth/jwt.strategy';
import { RefreshTokenGuard } from '@app/common/auth/refresh-token.guard';
import { RefreshTokenStrategy } from '@app/common/auth/refresh.strategy';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    PassportModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4000,
        },
      },
    ]),
    JwtModule.register({
      secret: jwtConstants.accessSecret,
      signOptions: { expiresIn: jwtConstants.accessExpiresIn },
    }),
    PrismaModule,
  ],
  controllers: [BoardController],
  providers: [BoardService, JwtStrategy, RefreshTokenGuard, RefreshTokenStrategy, JwtAuthGuard],
})
export class BoardModule { }
