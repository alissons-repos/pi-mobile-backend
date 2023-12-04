import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class SignInDto {
  @ValidateIf((o) => !o.email || o.cpf, {
    message: 'Utilize apenas uma das seguintes opções: CPF ou EMAIL!',
  })
  @IsNotEmpty({ message: 'O CPF é obrigatório!' })
  @IsString({ message: 'Insira um CPF válido!' })
  cpf: string;

  @ValidateIf((o) => !o.cpf || o.email, {
    message: 'Utilize apenas uma das seguintes opções: CPF ou EMAIL!',
  })
  @IsNotEmpty({ message: 'O email é obrigatório!' })
  @IsEmail({}, { message: 'Insira um email válido!' })
  email: string;

  @IsNotEmpty({ message: 'O senha é obrigatória!' })
  password: string;
}
