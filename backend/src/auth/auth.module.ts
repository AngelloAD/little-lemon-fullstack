import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsuariosModule,
    JwtModule.register({
      global: true,
      secret: 'MI_PALABRA_SECRETA_SUPER_SEGURA',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }