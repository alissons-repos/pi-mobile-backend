import { Injectable } from '@nestjs/common';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { IdParamDto } from 'src/utils/dto/id-param.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ObjectsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createObjectBody: CreateObjectDto) {
    return 'This action adds a new object';
  }

  findAll() {
    return `This action returns all objects`;
  }

  findOne(id: IdParamDto) {
    return `This action returns a #${id} object`;
  }

  update(id: IdParamDto, updateObjectBody: UpdateObjectDto) {
    return `This action updates a #${id} object`;
  }

  remove(id: IdParamDto) {
    return `This action removes a #${id} object`;
  }
}
