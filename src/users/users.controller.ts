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
import { SignInDto } from 'src/auth/dto/signin.dto';
import { fileValidation } from 'src/utils/helpers/multerOptions';
// import { Request } from 'express';
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

  // FIXME: enviar essa rota para auth
  @Patch('reset')
  updatePass(@Body() updateUserPassBody: SignInDto) {
    return this.usersService.updateUserPass(updateUserPassBody);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }

  @Patch('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @Req() req,
    @UploadedFile(fileValidation) avatar: Express.Multer.File,
  ) {
    return this.usersService.uploadUserAvatar(req, avatar);
  }

  // @Post('objects/upload')
  // @UseInterceptors(FilesInterceptor('photos', 4))
  // uploadObjectPhotos(
  //   @UploadedFiles(fileValidation)
  //   photos: Array<Express.Multer.File>,
  // ) {
  //   if (!photos) {
  //     throw new HttpException(
  //       'É obrigatório o envio de pelo menos uma foto do objeto!',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   return photos;
  // }
}
