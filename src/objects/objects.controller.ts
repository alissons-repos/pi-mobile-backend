import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
// import { IdParamDto } from 'src/utils/dtos/id-param.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileValidation } from 'src/utils/helpers/multerOptions';

@UseGuards(JwtAuthGuard)
@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Post()
  create(@Req() req: Request, @Body() createObjectBody: CreateObjectDto) {
    return this.objectsService.createObject(req, createObjectBody);
  }

  // @Get()
  // findAll() {
  //   return this.objectsService.findAllObjects();
  // }

  @Get()
  findUserObjects(@Req() req: Request) {
    return this.objectsService.findUserObjects(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objectsService.findObjectById(id);
  }

  @Put(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateObjectBody: UpdateObjectDto,
  ) {
    return this.objectsService.updateObject(req, id, updateObjectBody);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.objectsService.removeObject(req, id);
  }

  @Patch('upload/:id')
  @UseInterceptors(FilesInterceptor('photos', 4))
  upload(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFiles(fileValidation)
    photos: Array<Express.Multer.File>,
  ) {
    return this.objectsService.uploadObjectPhotos(req, id, photos);
  }
}
