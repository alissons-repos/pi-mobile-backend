import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
// import { IdParamDto } from 'src/utils/dto/id-param.dto';
import { fileValidation } from 'src/utils/helpers/multerOptions';
import { Request } from 'express';

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

  @Put()
  update(@Req() req: Request, @Body() updateUserBody: UpdateUserDto) {
    return this.usersService.updateUser(req, updateUserBody);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: Request) {
    return this.usersService.removeUser(req);
  }

  @Patch('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  upload(
    @Req() req: Request,
    @UploadedFile(fileValidation) avatar: Express.Multer.File,
  ) {
    return this.usersService.uploadUserAvatar(req, avatar);
  }
}
