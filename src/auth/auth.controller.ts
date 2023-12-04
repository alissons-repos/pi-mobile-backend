import {
  Body,
  Controller,
  // Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  // UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
// import { JwtAuthGuard } from './guard/jwt.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserBody: CreateUserDto) {
    return this.authService.signUp(createUserBody);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('signup')
  // signOut(@Body() createUserBody: CreateUserDto) {
  //   return this.authService.signOut(createUserBody);
  // }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInBody: SignInDto) {
    return this.authService.signIn(signInBody);
  }

  @Patch('reset')
  updatePass(@Body() signInBody: SignInDto) {
    return this.authService.resetUserPass(signInBody);
  }
}
