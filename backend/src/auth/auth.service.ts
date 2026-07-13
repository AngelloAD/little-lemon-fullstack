import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) { }

  async login(nombre: string, claveInsegura: string) {
    const usuario = await this.usuariosService.findByNombre(nombre);

    const isPasswordValid = usuario ? await bcrypt.compare(claveInsegura, usuario.password) : false;

    if (!usuario || !isPasswordValid) {
      throw new UnauthorizedException('El nombre de usuario o la contraseña son incorrectos');
    }

    const payload = { sub: usuario.id, nombre: usuario.nombre, rol: usuario.rol };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}