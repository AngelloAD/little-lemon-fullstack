import { IsNotEmpty, IsString, MinLength, IsEmail, IsEnum } from "class-validator";
import { Role } from "@prisma/client";

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    nombre!: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
    email!: string;

    @IsEnum(Role, { message: 'El rol debe ser un valor válido: ADMIN, CLIENTE o EMPLEADO' })
    @IsNotEmpty()
    rol!: Role;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password!: string;
}