import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuramos CORS para aceptar tanto tu entorno local como el futuro dominio de Render
  app.enableCors({
    origin: [
      'http://localhost:5173', 
      /https:\/\/.*\.onrender\.com$/ // Esto permite cualquier subdominio de Render de forma segura
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // Render asignará un puerto en process.env.PORT. Si no existe (como en tu PC), usará el 3000.
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on port: ${port}`);
}
bootstrap();
















// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     origin: 'http://localhost:5173',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });

//   app.useGlobalPipes(new ValidationPipe());

//   await app.listen(3000);
// }
// bootstrap();