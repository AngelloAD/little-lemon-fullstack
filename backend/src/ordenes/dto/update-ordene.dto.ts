import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrdenDto {
  @IsString({ message: 'El estado debe ser una cadena de texto válida.' })
  @IsNotEmpty({ message: 'El estado de la orden no puede estar vacío.' })
  @IsIn(['Pendiente', 'En Cocina', 'Entregado', 'Cancelado'], {
    message: 'El estado debe ser únicamente: Pendiente, En Cocina, Entregado o Cancelado.',
  })
  estado!: string;
}