import { PartialType } from '@nestjs/mapped-types';
import { CreateObjectDto } from './create-object.dto';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateObjectDto extends PartialType(CreateObjectDto) {
  @IsNotEmpty()
  @IsString()
  @IsIn(['found', 'lost'])
  situation: string;

  @IsNotEmpty()
  @IsString()
  object: string;

  @IsOptional()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characteristics: string[];

  @IsNotEmpty()
  @IsString()
  place: string;

  @IsNotEmpty()
  @IsDateString()
  datetime: string;

  @IsOptional()
  @IsString()
  info: string;
}
