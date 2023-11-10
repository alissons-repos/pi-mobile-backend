import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';

export class SignInDto {
  @ValidateIf((o) => !o.email || o.cpf, {
    message: 'Utilize apenas uma das seguintes opções: CPF ou EMAIL!',
  })
  @IsNotEmpty()
  @IsString()
  cpf: string;

  @ValidateIf((o) => !o.cpf || o.email, {
    message: 'Utilize apenas uma das seguintes opções: CPF ou EMAIL!',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
