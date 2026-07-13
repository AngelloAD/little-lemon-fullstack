import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, OnModuleInit } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdateUsuarioRolDto } from './dto/update-usuario-rol.dto';

import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('usuarios')
export class UsuariosController implements OnModuleInit {
  constructor(private readonly usuariosService: UsuariosService) { }

  async onModuleInit() {
    console.log('Verificando configuración del usuario administrador inicial...');
    const resultado = await this.usuariosService.ensureInitialAdmin();
    console.log(`[Base de Datos]: ${resultado.message}`);
  }

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Get('nombre/:nombre')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findByNombre(@Param('nombre') nombre: string) {
    return this.usuariosService.findByNombre(nombre);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Patch(':id/rol')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateRol(@Param('id') id: string, @Body() updateUsuarioRolDto: UpdateUsuarioRolDto) {
    return this.usuariosService.updateRol(+id, updateUsuarioRolDto.rol);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}