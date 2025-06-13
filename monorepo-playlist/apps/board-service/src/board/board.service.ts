import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.board.findMany();
  }

  async findOne(id: number) {
    const board = await this.prisma.board.findUnique({ where: { id }, include: { author: true } });
    if (!board) throw new NotFoundException('Board not found');
    return board;
  }

  async create(createBoardDto: CreateBoardDto, authorId: number) {
    return this.prisma.board.create({ data: { ...createBoardDto, authorId } });
  }
}