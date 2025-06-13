import { Controller, Post, Body, UseGuards, Res, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "@app/common/auth/public.decorator";
import { JwtAuthGuard } from "@app/common/auth/jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { Response, Request } from "express";
import { RefreshTokenGuard } from "@app/common/auth/refresh-token.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.login(
      dto.email,
      dto.password,
    );
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
    });
    return true;
  }

  @Post('/logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    return { message: 'Logged out successfully' };
  }

  @Post('rotate')
  @UseGuards(RefreshTokenGuard)
  async rotate(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const accessToken: string = req.cookies?.['accessToken'];
    if (!accessToken) return res.status(401).json({ message: '토큰이 없습니다.' });
    const newAccessToken = await this.authService.rotate(accessToken);
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
    });
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  profile(@Req() req) {
    return req.user;
  }
}