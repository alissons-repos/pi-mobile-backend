import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({ message: 'O email é obrigatório!' })
  @IsEmail({}, { message: 'Insira um email válido!' })
  email: string;

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
