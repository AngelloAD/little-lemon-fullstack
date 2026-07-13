import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createMenuDto: CreateMenuDto) {
    return this.prisma.menu.create({
      data: createMenuDto,
    });
  }

  async findAll() {
    return this.prisma.menu.findMany();
  }

  async findOne(id: number) {
    const menu = await this.prisma.menu.findUnique({ where: { id } })
    if (!menu) {
      throw new NotFoundException(`El menú con ID ${id} no existe`)
    }
    return menu
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    return this.prisma.menu.update({
      where: { id },
      data: updateMenuDto,
    });
  }

  async remove(id: number) {
    return this.prisma.menu.delete({
      where: { id },
    });
  }
}