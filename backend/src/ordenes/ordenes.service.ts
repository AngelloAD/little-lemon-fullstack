import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrdenDto } from './dto/create-ordene.dto';
import { UpdateOrdenDto } from './dto/update-ordene.dto';

@Injectable()
export class OrdenesService {
  constructor(private prisma: PrismaService) { }

  async create(createOrdenDto: CreateOrdenDto, usuarioId: number) {
    const usuarioExiste = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuarioExiste) {
      throw new NotFoundException(`El usuario con ID ${usuarioId} no existe en el sistema. No se puede crear la orden.`);
    }

    return this.prisma.orden.create({
      data: {
        platillo: createOrdenDto.platillo,
        notas: createOrdenDto.notas,
        clienteId: usuarioId,
      },
    });
  }

  async findAll() {
    return this.prisma.orden.findMany({
      include: {
        cliente: {
          select: { id: true, nombre: true, rol: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: number) {
    const orden = await this.prisma.orden.findUnique({
      where: { id },
    });

    if (!orden) {
      throw new NotFoundException(`La orden con ID ${id} no existe`);
    }

    return orden;
  }

  async update(id: number, updateOrdenDto: UpdateOrdenDto) {
    const ordenExiste = await this.prisma.orden.findUnique({ where: { id } });
    if (!ordenExiste) {
      throw new NotFoundException(`La orden con ID ${id} no existe en el sistema.`);
    }

    return this.prisma.orden.update({
      where: { id },
      data: {
        estado: updateOrdenDto.estado
      },
    });
  }

  async getDashboardStats() {
    const todasLasOrdenes = await this.prisma.orden.findMany();

    const totalReservas = await this.prisma.reserva.count();

    const platosMenu = await this.prisma.menu.findMany();

    const mapaPrecios = new Map(platosMenu.map(p => [p.name, Number(p.price)]));

    let ingresosTotales = 0;
    todasLasOrdenes.forEach((orden) => {
      if (orden.estado === 'Cancelado') return;

      const nombreLimpio = orden.platillo.split(' (')[0];
      const precioPlato = mapaPrecios.get(nombreLimpio) || 12.50;

      let cantidad = 1;
      const matchCantidad = orden.platillo.match(/\(x(\d+)\)/);
      if (matchCantidad) {
        cantidad = parseInt(matchCantidad[1], 10);
      }

      ingresosTotales += (precioPlato * cantidad);
    });

    return {
      ingresosTotales: Number(ingresosTotales.toFixed(2)),
      totalOrdenes: todasLasOrdenes.length,
      totalReservas: totalReservas,
      ordenesPendientes: todasLasOrdenes.filter(o => o.estado === 'Pendiente').length,
    };
  }

  async remove(id: number) {
    const ordenExiste = await this.prisma.orden.findUnique({ where: { id } });
    if (!ordenExiste) {
      throw new NotFoundException(`La orden con ID ${id} no existe en el sistema.`);
    }
    return this.prisma.orden.delete({
      where: { id },
    });
  }
}