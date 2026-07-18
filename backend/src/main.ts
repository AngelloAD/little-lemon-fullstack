import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // SI ESTÁS EN VERCEL: Solo inicializa la app
  if (process.env.VERCEL) {
    await app.init();
  } else {
    // SI ESTÁS LOCAL: Levanta el puerto 3000 para que responda a tu Frontend
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Backend corriendo localmente en: http://localhost:${port}`);
  }
}

bootstrap();

export default server;


































// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import express from 'express'; // <-- Cambiado a importación por defecto para solucionar el error

// // 1. Creamos la instancia de Express que Vercel necesita manejar
// const server = express();

// async function bootstrap() {
//   // 2. Le indicamos a NestJS que use el adaptador de Express creado arriba
//   const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

//   // 3. Mantenemos tu configuración de tuberías de validación
//   app.useGlobalPipes(new ValidationPipe());

//   // 4. Agregamos el prefijo global para que NestJS reconozca la ruta '/api' de Vercel
//   app.setGlobalPrefix('api');

//   // 5. Configuramos CORS abierto para desarrollo local y tu nuevo dominio de Vercel
//   app.enableCors({
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });

//   // 6. Inicializamos la aplicación interna de NestJS
//   await app.init();
// }

// bootstrap();

// // 7. ¡Vital para Vercel! Exportamos el servidor Express para la infraestructura Serverless
// export default server;





















