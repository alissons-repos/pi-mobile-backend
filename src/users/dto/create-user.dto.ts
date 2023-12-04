import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O CPF é obrigatório!' })
  @IsString({ message: 'Insira um CPF válido!' })
  cpf: string;

  @IsNotEmpty({ message: 'O email é obrigatório!' })
  @IsEmail({}, { message: 'Insira um email válido!' })
  email: string;

  @IsNotEmpty({ message: 'O senha é obrigatória!' })
  @IsStrongPassword(
    {
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      minLength: 8,
    },
    {
      message:
        'A senha deve conter ao menos: uma letra maiúscula, uma letra minúscula, um número e 8 caracteres!',
    },
  )
  password: string;

  @IsNotEmpty({ message: 'O primeiro nome é obrigatório!' })
  @IsString({ message: 'O primeiro nome deve ser do tipo texto!' })
  firstName: string;

  @IsNotEmpty({ message: 'O segundo nome é obrigatório!' })
  @IsString({ message: 'O segundo nome deve ser do tipo texto!' })
  lastName: string;

  @IsNotEmpty({ message: 'O telefone é obrigatório!' })
  @IsPhoneNumber('BR', {
    message: 'O telefone deve ter entre 10 e 11 dígitos (DDD + número)!',
  })
  phone: string;
}
