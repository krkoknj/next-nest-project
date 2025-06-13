// apps/auth-service/src/auth/auth.service.ts
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@app/prisma';
import { jwtConstants } from '@app/common/jwt/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) { }

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    console.log('validateUser', user)
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(pass, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { id: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.accessSecret,
      expiresIn: jwtConstants.accessExpiresIn,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshExpiresIn,
    });


    await this.cacheManager.set(`refreshToken:${user.id}`, refreshToken, 7 * 24 * 60 * 60);

    return { accessToken };
  }

  async rotate(expiredToken: string) {
    try {
      const decoded = this.jwtService.decode(expiredToken);
      if (!decoded) throw new UnauthorizedException('토큰이 올바르지 않습니다.');

      const storedRefreshToken = await this.cacheManager.get<string>(`refreshToken:${decoded.id}`);
      if (!storedRefreshToken) throw new UnauthorizedException('토큰이 만료되었습니다.');

      try {
        this.jwtService.verify(storedRefreshToken);
      } catch (error) {
        this.cacheManager.del(`refreshToken:${decoded.id}`);
        throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: decoded.id
        }
      });

      if (!user) throw new UnauthorizedException('사용자가 없습니다.');

      const newAccessToken = await this.jwtService.signAsync({ id: user.id, email: user.email }, {
        secret: jwtConstants.accessSecret,
        expiresIn: jwtConstants.accessExpiresIn,
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
