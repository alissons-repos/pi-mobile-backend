import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateItemDto } from './dto/create-items.dto';
import { UpdateItemDto } from './dto/update-items.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { Item } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { File } from 'buffer';
// import { IdParamDto } from 'src/utils/dtos/id-param.dto';

@Injectable()
export class ItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createItem(
    req: Request,
    createItemBody: CreateItemDto,
  ): Promise<Item | never> {
    const userID: string = req.user['id'];

    const data = {
      ...createItemBody,
      datetime: new Date(createItemBody.datetime).toISOString(),
      recordOwnerId: userID,
      photos: ['default-photo.jpg'],
    };

    try {
      const newItem = await this.prisma.item.create({ data });

      this.eventEmitter.emit('item.created', newItem.id);

      return newItem;
    } catch (e) {
      console.error('Erro Logado:', e);
      // throw new HttpException(
      //   'Erro interno na aplicação',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }

  async findUserItems(req: Request): Promise<Item[] | never> {
    try {
      const userID: string = req.user['id'];

      const userItems = await this.prisma.user.findUnique({
        where: { id: userID },
        include: { items: true },
      });

      return userItems.items;
    } catch (e) {
      console.error('Erro Logado:', e);
    }
  }

  // async findAllItems(): Promise<Item[] | never> {
  //   try {
  //     const itemsList = await this.prisma.item.findMany();

  //     return itemsList;
  //   } catch (e) {
  //     console.error('Erro Logado:', e);
  //   }
  // }

  async findItemById(id: string): Promise<Item | never> {
    const item = await this.prisma.item.findUnique({ where: { id } });

    if (!item) {
      throw new HttpException('Objeto não encontrado!', HttpStatus.NOT_FOUND);
    }

    return item;
  }

  async updateItem(
    req: Request,
    id: string,
    updateItemBody: UpdateItemDto,
  ): Promise<Item | never> {
    const userID: string = req.user['id'];

    const userItem = await this.prisma.item.findUnique({
      where: { id },
    });

    if (userItem.recordOwnerId !== userID) {
      throw new HttpException('Objeto não encontrado!', HttpStatus.NOT_FOUND);
    }

    const data = {
      ...updateItemBody,
      datetime: new Date(updateItemBody.datetime).toISOString(),
    };

    try {
      const item = await this.prisma.item.update({ where: { id }, data });

      this.eventEmitter.emit('item.updated');

      return item;
    } catch (e) {
      console.error('Erro Logado:', e);
    }
  }

  async uploadItemPhotos(
    req: Request,
    id: string,
    photos: Array<Express.Multer.File>,
  ): Promise<Item | never> {
    if (!photos) {
      throw new HttpException(
        'É obrigatório o envio de pelo menos uma foto do objeto!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userID: string = req.user['id'];
    const itemPhotos: Array<string> = [];

    const userItem = await this.prisma.user.findUnique({
      where: { id: userID },
      select: { items: { where: { id } } },
    });

    if (!userItem) {
      throw new HttpException('Objeto não encontrado!', HttpStatus.NOT_FOUND);
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      { auth: { persistSession: false } },
    );

    for (let i = 0; i < photos.length; i++) {
      const photoFileName = `${userID}-photo-${i}`;

      const file = new File([photos[i].buffer], photoFileName, {
        type: photos[i].mimetype,
      });

      const { error } = await supabase.storage
        .from('objectsPhotos')
        .upload(photoFileName, file, { upsert: true });

      if (error) {
        console.error('Erro Supabase: ', error);

        throw new HttpException(
          'Algo deu errado ao tentar enviar as imagens!',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const photosPublicUrl = supabase.storage
        .from('objectsPhotos')
        .getPublicUrl(photoFileName).data.publicUrl;

      itemPhotos.push(photosPublicUrl);
    }

    try {
      const item = await this.prisma.item.update({
        where: { id },
        data: { photos: itemPhotos },
      });

      this.eventEmitter.emit('item.updated');

      return item;
    } catch (e) {
      console.error('Erro Logado:', e);
    }
  }

  async removeItem(req: Request, id: string) {
    const userID: string = req.user['id'];

    const userItem = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!userItem || userItem.recordOwnerId !== userID) {
      throw new HttpException('Objeto não encontrado!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.item.delete({ where: { id } });
    } catch (e) {
      console.error('Erro Logado:', e);
    }
  }
}
