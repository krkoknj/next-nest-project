import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@app/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async create(email: string, password: string, name: string) {
    const hash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({ data: { email, password: hash, name } });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async compareUserRefreshToken(email: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user?.refreshToken) return false;
    const result = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!result) return false;
    return true;
  }
}