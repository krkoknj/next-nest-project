import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '@app/common/auth/public.decorator';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { validate } from 'class-validator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public()
  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.userService.create(dto.email, dto.password, dto.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @MessagePattern({ cmd: "compareUserRefreshToken" })
  async compareUserRefreshToken(@Payload() email: string, @Payload() refreshToken: string) {
    return this.userService.compareUserRefreshToken(email, refreshToken);
  }
}
