import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@app/common/jwt/constants';
import { PrismaModule } from '@app/prisma';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@app/common/auth/jwt.strategy';
import { RefreshTokenGuard } from '@app/common/auth/refresh-token.guard';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RefreshTokenStrategy } from '@app/common/auth/refresh.strategy';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';
import { RedisClientModule } from '@app/redis-client';

@Module({
  imports: [
    RedisClientModule,
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
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenGuard, RefreshTokenStrategy, JwtAuthGuard],
})
export class AuthModule { }
