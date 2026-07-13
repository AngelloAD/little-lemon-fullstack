import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.get<string | string[]>('roles', context.getHandler());

    if (!rolesRequeridos) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    if (!usuario) {
      throw new UnauthorizedException('No se ha podido verificar la identidad para validar los roles');
    }

    const tienePermiso = Array.isArray(rolesRequeridos)
      ? rolesRequeridos.includes(usuario.rol)
      : rolesRequeridos === usuario.rol;

    if (!tienePermiso) {
      throw new ForbiddenException('No tienes los permisos necesarios para acceder a esta ruta');
    }

    return true;
  }
}