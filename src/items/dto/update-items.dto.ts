import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-items.dto';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @IsNotEmpty({ message: 'A situação do objeto é obrigatória!' })
  @IsString({ message: 'A situação do objeto deve ser do tipo texto!' })
  @IsIn(['found', 'lost'])
  situation: string;

  @IsNotEmpty({ message: 'O tipo de objeto é obrigatório!' })
  @IsString({ message: 'O tipo de objeto deve ser do tipo texto!' })
  objectType: string;

  @IsOptional()
  @IsString({ message: 'A marca do objeto deve ser do tipo texto!' })
  brand: string;

  @IsOptional()
  @IsString({ message: 'O modelo do objeto deve ser do tipo texto!' })
  model: string;

  @IsNotEmpty({ message: 'A cor predominante do item é obrigatória!' })
  @IsString({ message: 'A cor predominantes deve ser do tipo texto!' })
  color: string;

  @IsOptional()
  @IsArray({
    message: 'O campo aceita várias caracaterísticas separadas por vírgula!',
  })
  @IsString({
    each: true,
    message: 'Cada característica adicionada deve ser do tipo texto!',
  })
  characteristics: string[];

  @IsNotEmpty({ message: 'O lugar é obrigatório!' })
  @IsString({ message: 'O lugar deve ser do tipo texto!' })
  place: string;

  @IsNotEmpty({ message: 'A data e a hora são é obrigatórios!' })
  @IsDateString(
    {},
    {
      message:
        'A data e a hora devem estar no formato ISO-8601: YYYY-MM-DDTHH:mm:ss.sssZ!',
    },
  )
  datetime: string;

  @IsOptional()
  @IsString({ message: 'A informação adicional deve ser do tipo texto!' })
  info: string;
}
