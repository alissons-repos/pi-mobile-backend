import { IsMongoId, IsString } from 'class-validator';

export class IdParamDto {
  @IsString({ message: 'Parâmetro ID inválido ou inexistente!' })
  @IsMongoId({ message: 'Parâmetro ID inválido ou inexistente!' })
  id: string;
}
