import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { UpdateUserPassDto } from './dto/update-user-pass.dto';
// import { IdParamDto } from 'src/utils/dto/id-param.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserBody: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserBody);
  }

  @Patch('reset')
  updatePass(@Body() updateUserPassBody: UpdateUserPassDto) {
    return this.usersService.updateUserPass(updateUserPassBody);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
