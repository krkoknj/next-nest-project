import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';
import { RefreshTokenGuard } from '@app/common/auth/refresh-token.guard';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    const boards = this.boardService.findAll();
    console.log('boards', boards);
    return boards;
  }

  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.boardService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  create(@Req() req: any, @Body() createBoardDto: CreateBoardDto) {
    const { userId } = req.user;
    return this.boardService.create(createBoardDto, userId);
  }
}