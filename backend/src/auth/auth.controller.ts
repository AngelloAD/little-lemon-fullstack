import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() body: { nombre: string; password: string }) {

    return this.authService.login(body.nombre, body.password);
  }
}