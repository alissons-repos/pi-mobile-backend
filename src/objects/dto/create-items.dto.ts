import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['found', 'lost'])
  situation: string;

  @IsNotEmpty()
  @IsString()
  objectType: string;

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
