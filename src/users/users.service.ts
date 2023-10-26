import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// import { IdParamDto } from 'src/utils/dto/id-param.dto';
import { UserWithoutHash } from 'src/utils/types/UserCustomTypes.type';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserBody: CreateUserDto): Promise<User | never> {
    const { cpf, email } = createUserBody;

    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ cpf: { equals: cpf } }, { email: { equals: email } }] },
    });

    if (exists) {
      throw new HttpException(
        'Dados de CPF ou EMAIL já cadastrados no sistema!',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const newUser = await this.prisma.user.create({
        data: createUserBody,
      });

      return newUser;
    } catch (e) {
      console.error(e);

      throw new HttpException(
        'Erro interno na aplicação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUsers(): Promise<UserWithoutHash[] | never> {
    try {
      const usersList = await this.prisma.user.findMany();
      const userListWithoutHash = usersList.map((user) => {
        // delete user.hash;
        return user;
      });

      return userListWithoutHash;
    } catch (e) {
      console.error(e);

      throw new HttpException(
        'Erro interno na aplicação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserById(id: string): Promise<UserWithoutHash | never> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }

    delete user.hash;
    return user;

    // if (e instanceof PrismaClientKnownRequestError) {
    //   console.log('Caso 1');
    //   if ((e.code = 'P2023')) {
    //     throw new HttpException(
    //       'Parâmetro ID inválido!',
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }
    // }
  }

  async updateUser(
    id: string,
    updateUserBody: UpdateUserDto,
  ): Promise<UserWithoutHash> {
    const { hash, cpf } = updateUserBody;

    if (hash || cpf) {
      delete updateUserBody.hash;
      delete updateUserBody.cpf;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserBody,
    });

    delete user.hash;
    return user;
  }

  async removeUser(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return;
  }
}
