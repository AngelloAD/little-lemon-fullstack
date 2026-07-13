import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservaDto } from './dto/create-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createReservaDto: CreateReservaDto, clienteId: number) {
    return this.prisma.reserva.create({
      data: {
        ...createReservaDto,
        clienteId: clienteId,
      },
    });
  }

  async findAllByClient(clienteId: number) {
    return this.prisma.reserva.findMany({
      where: { clienteId: clienteId },
    });
  }

  async remove(id: number) {
    return this.prisma.reserva.delete({
      where: { id },
    });
  }

  async findAllGlobal() {
    return this.prisma.reserva.findMany({
      include: {
        cliente: {
          select: { id: true, nombre: true, email: true }
        }
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });
  }

}