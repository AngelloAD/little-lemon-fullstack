import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrdenDto {
    @IsString()
    @IsNotEmpty()
    platillo!: string;

    @IsString()
    @IsNotEmpty()
    notas!: string;
}