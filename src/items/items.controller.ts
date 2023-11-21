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
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-items.dto';
import { UpdateItemDto } from './dto/update-items.dto';
// import { IdParamDto } from 'src/utils/dtos/id-param.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileValidation } from 'src/utils/helpers/multerOptions';

@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  createItem(@Req() req: Request, @Body() createItemBody: CreateItemDto) {
    return this.itemsService.createItem(req, createItemBody);
  }

  @Get()
  findUserItems(@Req() req: Request) {
    return this.itemsService.findUserItems(req);
  }

  // @Get()
  // findAllItems() {
  //   return this.itemsService.findAllItems();
  // }

  @Get(':id')
  findItemById(@Param('id') id: string) {
    return this.itemsService.findItemById(id);
  }

  @Put(':id')
  updateItem(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateItemBody: UpdateItemDto,
  ) {
    return this.itemsService.updateItem(req, id, updateItemBody);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeItem(@Req() req: Request, @Param('id') id: string) {
    return this.itemsService.removeItem(req, id);
  }

  @Patch('upload/:id')
  @UseInterceptors(FilesInterceptor('photos', 4))
  uploadItemPhotos(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFiles(fileValidation)
    photos: Array<Express.Multer.File>,
  ) {
    return this.itemsService.uploadItemPhotos(req, id, photos);
  }
}
