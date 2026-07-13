import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  private readonly SALT_ROUNDS = 10;

  private readonly usuarioSeleccionado = {
    id: true,
    nombre: true,
    email: true,
    rol: true,
  };

  constructor(private readonly prisma: PrismaService) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, this.SALT_ROUNDS);

    try {
      return await this.prisma.usuario.create({
        data: {
          nombre: createUsuarioDto.nombre,
          email: createUsuarioDto.email,
          rol: createUsuarioDto.rol,
          password: hashedPassword,
        },
        select: this.usuarioSeleccionado,
      });
    } catch (error) {
      this.manejarErroresPrisma(error, 'El nombre o el correo electrónico ya están en uso');
    }
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      select: this.usuarioSeleccionado,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: this.usuarioSeleccionado,
    });

    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${id} no existe`);
    }
    return usuario;
  }

  async updateRol(id: number, rol: Role) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${id} no existe`);
    }
    if (usuario.nombre.toLowerCase() === 'admin') {
      throw new ForbiddenException('Acción denegada: El rol del administrador principal es vital y no se puede modificar.');
    }

    try {
      return await this.prisma.usuario.update({
        where: { id },
        data: { rol },
        select: this.usuarioSeleccionado,
      });
    } catch (error) {
      this.manejarErroresPrisma(error);
    }
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const { password, ...datosAActualizar } = updateUsuarioDto;
    const data: Prisma.UsuarioUpdateInput = { ...datosAActualizar };

    if (password) {
      data.password = await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    try {
      return await this.prisma.usuario.update({
        where: { id },
        data,
        select: this.usuarioSeleccionado,
      });
    } catch (error) {
      this.manejarErroresPrisma(error, 'El nombre o correo electrónico ya están siendo utilizados por otro usuario');
    }
  }

  async remove(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${id} no existe`);
    }

    if (usuario.nombre.toLowerCase() === 'admin') {
      throw new ForbiddenException('Acción denegada: El administrador principal del sistema no puede ser eliminado bajo ninguna circunstancia.');
    }

    try {
      return await this.prisma.usuario.delete({
        where: { id },
        select: this.usuarioSeleccionado,
      });
    } catch (error) {
      this.manejarErroresPrisma(error);
    }
  }


  async findByNombre(nombre: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { nombre },
    });
    if (!usuario) throw new NotFoundException(`Usuario ${nombre} no encontrado`);
    return usuario;
  }

  async ensureInitialAdmin() {
    const nombreAdmin = 'admin';
    const emailAdmin = 'admin@mail.com';

    const usuarioExistente = await this.prisma.usuario.findFirst({
      where: {
        OR: [{ nombre: nombreAdmin }, { email: emailAdmin }]
      },
    });

    if (usuarioExistente) {
      return {
        status: 'exists',
        message: 'El usuario administrador inicial ya está configurado'
      };
    }

    const defaultPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(defaultPassword, this.SALT_ROUNDS);

    const adminUsuario = await this.prisma.usuario.create({
      data: {
        nombre: nombreAdmin,
        email: emailAdmin,
        rol: Role.ADMIN,
        password: hashedPassword
      },
      select: this.usuarioSeleccionado,
    });

    return {
      status: 'success',
      message: 'Usuario administrador inicial creado con éxito',
      data: adminUsuario
    };
  }

  private manejarErroresPrisma(error: any, mensajeConflicto?: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('El usuario solicitado no existe');
      }
      if (error.code === 'P2002') {
        throw new ConflictException(mensajeConflicto || 'Ya existe un registro con estos datos únicos');
      }
    }
    throw error;
  }
}