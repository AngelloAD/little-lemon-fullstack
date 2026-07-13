import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateReservaDto {
  @IsString({ message: 'La fecha debe ser un texto válido.' })
  date!: string;

  @IsString({ message: 'La hora debe ser un texto válido.' })
  time!: string;

  @IsNumber({}, { message: 'El número de personas debe ser un número entero.' })
  @Min(1, { message: 'Debe reservar para al menos 1 persona.' })
  @Max(20, { message: 'El límite máximo por reserva web es de 20 personas.' })
  number_of_people!: number;

  @IsString({ message: 'Las solicitudes especiales deben ser un texto.' })
  @IsOptional()
  special_requests?: string;
}