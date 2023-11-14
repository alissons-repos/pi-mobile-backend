/* eslint-disable @typescript-eslint/ban-types */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
// import { IdParamDto } from 'src/utils/dtos/id-param.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { Object } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { File } from 'buffer';

@Injectable()
export class ObjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async createObject(
    req: Request,
    createObjectBody: CreateObjectDto,
  ): Promise<Object | never> {
    const userID: string = req.user['id'];

    const data = {
      ...createObjectBody,
      datetime: new Date(createObjectBody.datetime).toISOString(),
      recordOwnerId: userID,
      photos: ['default-photo.jpg'],
    };

    try {
      const newObject = await this.prisma.object.create({ data });

      return newObject;
    } catch (e) {
      console.error('Erro Logado:', e);
      // throw new HttpException(
      //   'Erro interno na aplicação',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }

  // async findAllObjects(): Promise<Object[] | never> {
  //   try {
  //     const objectsList = await this.prisma.object.findMany();

  //     return objectsList;
  //   } catch (e) {
  //     console.error('Erro Logado:', e);
  //   }
  // }

  async findUserObjects(req: Request): Promise<Object[] | never> {
    try {
      const userID: string = req.user['id'];

      const userObjects = await this.prisma.user.findUnique({
        where: { id: userID },
        include: { objects: true },
      });

      return userObjects.objects;
    } catch (e) {
      console.error('Erro Logado:', e);
    }
  }

  async findObjectById(id: string): Promise<Object | never> {
    try {
      const object = await this.prisma.object.findUnique({ where: { id } });

      if (!object) {
        throw new HttpException('Objeto não encontrado!', HttpStatus.NOT_FOUND);
      }

      return object;
    } catch (e) {
      console.error('Erro Logado:', e);
    }
  }

  async updateObject(
    req: Request,
    id: string,
    updateObjectBody: UpdateObjectDto,
  ): Promise<Object | never> {
    const userID: string = req.user['id'];

    const userObject = await this.prisma.object.findUnique({
      where: { id },
    });

    if (userObject.recordOwnerId !== userID) {
      throw new HttpException('Objeto não encontrado!', HttpStatus.NOT_FOUND);
    }

    const data = {
      ...updateObjectBody,
      datetime: new Date(updateObjectBody.datetime).toISOString(),
    };

    try {
      const object = await this.prisma.object.update({ where: { id }, data });
      return object;
    } catch (e) {
      console.error('Erro Logado:', e);
    }
  }

  async removeObject(req: Request, id: string) {
    const userID: string = req.user['id'];

    const userObject = await this.prisma.object.findUnique({
      where: { id },
    });

    if (userObject.recordOwnerId !== userID) {
      throw new HttpException('Objeto não encontrado!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.object.delete({ where: { id } });
    } catch (e) {
      console.error('Erro Logado:', e);
    }
  }

  async uploadObjectPhotos(
    req: Request,
    id: string,
    photos: Array<Express.Multer.File>,
  ): Promise<Object | never> {
    if (!photos) {
      throw new HttpException(
        'É obrigatório o envio de pelo menos uma foto do objeto!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userID: string = req.user['id'];
    const objectPhotos: Array<string> = [];

    const userObject = await this.prisma.user.findUnique({
      where: { id: userID },
      select: { objects: { where: { id } } },
    });

    if (!userObject) {
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

      console.log(file);

      const { error } = await supabase.storage
        .from('objectsPhotos')
        .upload(photoFileName, file, { upsert: true });

      if (error) {
        console.log('Erro aqui: ', error);

        throw new HttpException(
          'Algo deu errado ao tentar enviar as imagens!',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const photosPublicUrl = supabase.storage
        .from('objectsPhotos')
        .getPublicUrl(photoFileName).data.publicUrl;

      objectPhotos.push(photosPublicUrl);
    }

    try {
      const object = await this.prisma.object.update({
        where: { id },
        data: { photos: objectPhotos },
      });

      return object;
    } catch (e) {
      console.error('Erro Logado:', e);
    }
  }
}
