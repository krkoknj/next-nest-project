import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@app/prisma';
import { JwtStrategy } from '@app/common/auth/jwt.strategy';
import { RefreshTokenGuard } from '@app/common/auth/refresh-token.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@app/common/jwt/constants';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.accessSecret,
      signOptions: { expiresIn: jwtConstants.accessExpiresIn },
    }),],
  providers: [UserService, JwtStrategy, RefreshTokenGuard, JwtAuthGuard],
  controllers: [UserController],
  exports: [],
})
export class UserModule { }