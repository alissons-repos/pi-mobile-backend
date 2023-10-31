import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPassDto } from './dto/update-user-pass.dto';
// import { IdParamDto } from 'src/utils/dto/id-param.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserBody: CreateUserDto) {
    return this.usersService.createUser(createUserBody);
  }

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
