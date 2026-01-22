import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Activity-log-ms')

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.natServers,
    }
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  await app.startAllMicroservices()
  console.log('✅ Microservicio conectado a NATS (Activity-log-MS)');
  
  await app.listen( envs.port ) // GraphQL Expuesto localmente
  logger.log(`Activity Log Microservice running on port ${ envs.port }`);
}
bootstrap();
