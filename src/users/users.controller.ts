import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  // Param,
  Patch,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { fileValidation } from 'src/utils/helpers/multerOptions';
import { Request } from 'express';
// import { IdParamDto } from 'src/utils/dto/id-param.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // findAllUsers() {
  //   return this.usersService.findAllUsers();
  // }

  // @Get(':id')
  // findUserById(@Param('id') id: string) {
  //   return this.usersService.findUserById(id);
  // }

  @Get()
  findUser(@Req() req: Request) {
    return this.usersService.findUser(req);
  }

  @Put()
  updateUser(@Req() req: Request, @Body() updateUserBody: UpdateUserDto) {
    return this.usersService.updateUser(req, updateUserBody);
  }

  @Patch('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadUserAvatar(
    @Req() req: Request,
    @UploadedFile(fileValidation) avatar: Express.Multer.File,
  ) {
    return this.usersService.uploadUserAvatar(req, avatar);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  removeUser(@Req() req: Request) {
    return this.usersService.removeUser(req);
  }
}
