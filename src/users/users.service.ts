import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInDto } from 'src/auth/dto/signin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserWithoutHash } from 'src/utils/types/UserCustomTypes.type';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { createClient } from '@supabase/supabase-js';
import { File } from 'buffer';
// import { IdParamDto } from 'src/utils/dto/id-param.dto';

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
        'Credenciais, CPF ou EMAIL, já cadastrados no sistema!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = {
      ...createUserBody,
      avatar: 'default-avatar.jpg',
      hash: await bcrypt.hash(createUserBody.password, 10),
    };

    delete data.password;

    try {
      const newUser = await this.prisma.user.create({ data });

      return newUser;
    } catch (e) {
      console.error('Erro Logado:', e);
      // throw new HttpException(
      //   'Erro interno na aplicação',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }

  async findUsers(): Promise<UserWithoutHash[] | never> {
    try {
      const usersList = await this.prisma.user.findMany();
      const userListWithoutHash = usersList.map((user) => {
        delete user.hash;
        return user;
      });

      return userListWithoutHash;
    } catch (e) {
      console.error('Erro Logado:', e);
      // throw new HttpException(
      //   'Erro interno na aplicação',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
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

  async findUserBy(prop: string): Promise<User | never> {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ cpf: { equals: prop } }, { email: { equals: prop } }] },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async updateUser(
    id: string,
    updateUserBody: UpdateUserDto,
  ): Promise<UserWithoutHash | never> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserBody,
      });

      delete user.hash;
      return user;
    } catch (e) {
      console.error('Erro Logado:', e);
      // throw new HttpException(
      //   'Erro interno na aplicação',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }

  async updateUserPass(
    updateUserPassBody: SignInDto,
  ): Promise<UserWithoutHash | never> {
    const { cpf, email, password } = updateUserPassBody;

    let user: User;

    if (cpf && !email) user = await this.findUserBy(cpf);
    if (email && !cpf) user = await this.findUserBy(email);

    const id = user.id;
    const data = { hash: await bcrypt.hash(password, 10) };

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });

      delete user.hash;
      return user;
    } catch (e) {
      console.error('Erro Logado:', e);
      // throw new HttpException(
      //   'Erro interno na aplicação',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }

  async removeUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }

    try {
      await this.prisma.user.delete({ where: { id } });
      return;
    } catch (e) {
      console.error('Erro Logado:', e);
      // throw new HttpException(
      //   'Erro interno na aplicação',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }

  async uploadUserAvatar(
    req: Request,
    avatar: Express.Multer.File,
  ): Promise<UserWithoutHash | never> {
    if (!avatar) {
      throw new HttpException(
        'É obrigatório o envio de pelo menos uma foto de perfil!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      { auth: { persistSession: false } },
    );

    const userID = req.user['id'];
    const avatarFileName = `${userID}-avatar`;
    const file = new File([avatar.buffer], avatarFileName, {
      type: avatar.mimetype,
    });

    const { error } = await supabase.storage
      .from('usersAvatars')
      .upload(avatarFileName, file, { upsert: true });

    if (error) {
      console.log('Erro aqui: ', error);

      throw new HttpException(
        'Algo deu errado ao tentar enviar a imagem!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const avatarPublicUrl = supabase.storage
      .from('usersAvatars')
      .getPublicUrl(avatarFileName).data.publicUrl;

    const user = this.prisma.user.findUnique({ where: { id: userID } });

    if (!user) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: userID },
        data: { avatar: avatarPublicUrl },
      });

      delete user.hash;
      return user;
    } catch (e) {
      console.error('Erro Logado:', e);
    }
  }
}
