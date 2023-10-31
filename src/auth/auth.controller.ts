import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserBody: CreateUserDto) {
    return this.authService.signUp(createUserBody);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInBody: SignInDto) {
    return this.authService.signIn(signInBody);
  }
}
