import { IsString, IsNumber, IsOptional, Min, MinLength, IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
    @IsString({ message: 'El nombre del plato debe ser un texto.' })
    @MinLength(3, { message: 'El nombre del plato debe tener al menos 3 caracteres.' })
    name!: string;

    @IsNumber({}, { message: 'El precio debe ser un número válido.' })
    @Min(0.01, { message: 'El precio debe ser mayor a 0.' })
    price!: number;

    @IsString({ message: 'La descripción debe ser un texto.' })
    @MinLength(5, { message: 'La descripción del plato debe tener al menos 5 caracteres.' })
    description!: string;

    @IsString({ message: 'La categoría debe ser un texto válido.' })
    @IsNotEmpty({ message: 'La categoría es obligatoria y no puede estar vacía.' })
    category!: string;

    @IsString({ message: 'La URL de la imagen debe ser un texto.' })
    @IsOptional()
    image?: string;
}