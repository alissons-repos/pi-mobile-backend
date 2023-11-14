import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/signin.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    signInBody: SignInDto,
  ): Promise<{ access_token: string } | never> {
    const user = await this.verifyCredentials(signInBody);

    if (!user) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async signUp(
    createUserBody: CreateUserDto,
  ): Promise<{ access_token: string } | never> {
    const user = await this.usersService.createUser(createUserBody);

    if (!user) {
      throw new HttpException(
        'Erro interno na aplicação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async resetUserPass(
    signInBody: SignInDto,
  ): Promise<{ access_token: string } | never> {
    const user = await this.verifyCredentials(signInBody);

    if (!user) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    const id = user.id;
    const data = { hash: await bcrypt.hash(signInBody.password, 10) };

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });

      const payload = { sub: user.id };

      return { access_token: this.jwtService.sign(payload) };
    } catch (e) {
      console.error('Erro Logado:', e);
      // throw new HttpException(
      //   'Erro interno na aplicação',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }

  async verifyCredentials(signInBody: SignInDto): Promise<User | never> {
    const { cpf, email, password } = signInBody;

    let user: User;
    if (cpf && email) {
      throw new HttpException(
        'Utilize apenas uma das seguintes opções: CPF ou EMAIL!',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (cpf && !email) user = await this.usersService.findUserBy(cpf);
    if (email && !cpf) user = await this.usersService.findUserBy(email);

    const isValidHash = await bcrypt.compare(password, user.hash);

    if (user && isValidHash) {
      delete user.hash;
      return user;
    }

    return null;
  }
}
