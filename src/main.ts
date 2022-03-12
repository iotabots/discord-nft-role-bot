import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://iotabots.io',
    ],
    allowedHeaders: [
      'Access-Control-Allow-Credentials',
      'Content-Type',
      'Access-Control-Allow-Origin',
    ],
    credentials: true,
  });
  await app.listen(5000);
}
bootstrap();
