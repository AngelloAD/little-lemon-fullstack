import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { AuthGuard } from '../auth/auth.guard';

import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';


@Controller('reservas')
@UseGuards(AuthGuard, RolesGuard)
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) { }

  @Post()
  create(@Body() createReservaDto: CreateReservaDto, @Request() req: any) {
    const clienteId = req.user.sub;
    return this.reservasService.create(createReservaDto, clienteId);
  }

  @Get()
  findAll(@Request() req: any) {
    const clienteId = req.user.sub;
    return this.reservasService.findAllByClient(clienteId);
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  findAllAdmin() {
    return this.reservasService.findAllGlobal();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservasService.remove(+id);
  }
}