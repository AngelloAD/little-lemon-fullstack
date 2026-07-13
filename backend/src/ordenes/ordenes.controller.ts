import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { CreateOrdenDto } from './dto/create-ordene.dto';
import { UpdateOrdenDto } from './dto/update-ordene.dto';
import { AuthGuard } from '../auth/auth.guard';

import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client/edge';

@Controller('ordenes')
@UseGuards(AuthGuard, RolesGuard)
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) { }

  @Get('dashboard')
  @Roles(Role.ADMIN)
  getDashboardStats() {
    return this.ordenesService.getDashboardStats();
  }

  @Post()
  create(
    @Req() request: any,
    @Body() createOrdeneDto: CreateOrdenDto
  ) {
    const usuarioId = request.user.sub;
    return this.ordenesService.create(createOrdeneDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.ordenesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateOrdeneDto: UpdateOrdenDto) {
    return this.ordenesService.update(+id, updateOrdeneDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.ordenesService.remove(+id);
  }
}