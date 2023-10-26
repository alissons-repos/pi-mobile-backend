import { IsMongoId, IsString } from 'class-validator';

export class IdParamDto {
  @IsString()
  @IsMongoId({ message: 'Parâmetro ID inválido ou inexistente!' })
  id: string;
}
