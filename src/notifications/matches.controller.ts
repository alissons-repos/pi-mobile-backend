import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  triggerMatchSearch() {
    return this.matchesService.triggerMatchSearch();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findUserMatches(@Req() req: Request) {
    return this.matchesService.findUserMatches(req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteMatches() {
    return this.matchesService.deleteMatches();
  }
}
