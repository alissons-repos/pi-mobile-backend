import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateObjectDto {
  @IsNotEmpty()
  @IsBoolean()
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
  characteristics: string[];

  @IsNotEmpty()
  @IsString()
  place: string;

  @IsNotEmpty()
  @IsDate()
  date: string;

  @IsNotEmpty()
  @IsDate()
  time: string;

  @IsOptional()
  @IsString()
  info: string;
}
