import {
  Controller,
  // Delete,
  Get,
  // HttpCode,
  // HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  triggerMatchSearch() {
    return this.matchesService.triggerMatchSearch();
  }

  @Get()
  findUserMatches(@Req() req: Request) {
    return this.matchesService.findUserMatches(req);
  }

  // @Get()
  // findAllMatches() {
  //   return this.matchesService.findAllMatches();
  // }

  @Get(':id')
  findMatchById(@Param('id') id: string) {
    return this.matchesService.findMatchById(id);
  }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // removeMatch(@Req() req: Request, @Param('id') id: string) {
  //   return this.matchesService.removeMatch(req, id);
  // }
}
