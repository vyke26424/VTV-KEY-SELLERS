import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth/auth/auth.service';
import { LoginDto } from './auth/dto/login.dto';
import { SignupDto } from './auth/dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) { // NestJS sẽ tự động kiểm tra email, password theo quy tắc trong DTO
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}