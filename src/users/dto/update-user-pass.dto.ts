import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserPassDto {
  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
