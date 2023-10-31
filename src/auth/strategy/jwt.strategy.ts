import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserWithoutHash } from 'src/utils/types/UserCustomTypes.type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string }): Promise<UserWithoutHash | never> {
    if (!payload || !payload.sub) {
      throw new HttpException('Acesso negado!', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.findUserById(payload.sub);

    if (!user) {
      throw new HttpException('Acesso negado!', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
