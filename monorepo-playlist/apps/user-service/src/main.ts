import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) HTTP server
  app.enableCors({ origin: true, credentials: true });
  await app.listen(3334);
  console.log('HTTP server listening on http://localhost:3334');

  // 2) TCP microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { port: 4000 },
  });
  await app.startAllMicroservices();
  console.log('TCP microservice listening on port 4000');
}
bootstrap();
