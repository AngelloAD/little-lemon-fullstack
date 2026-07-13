import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { ReservasModule } from './reservas/reservas.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsuariosModule, PrismaModule, OrdenesModule, AuthModule, MenuModule, ReservasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}