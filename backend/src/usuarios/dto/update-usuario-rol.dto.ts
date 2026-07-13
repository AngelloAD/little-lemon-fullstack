import { IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUsuarioRolDto {
    @IsEnum(Role, {
        message: 'El rol debe ser un valor válido de la base de datos: ADMIN, CLIENTE o EMPLEADO.',
    })
    @IsNotEmpty({ message: 'El rol no puede estar vacío.' })
    rol!: Role;
}