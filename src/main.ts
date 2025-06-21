import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QueueNames } from './queue/constants/queue.constants';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
      forbidUnknownValues: true,
      stopAtFirstError: true,
    }),
  );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_CONNECTION_URL')],
      queue: QueueNames.AUTH,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_CONNECTION_URL')],
      queue: QueueNames.PROJECTS,
      queueOptions: {
        durable: true,
      },
    },
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hio API Documentation')
    .setDescription(
      'API providing authentication and project management features',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);
  //app.use(passport.initialize());

  await app.startAllMicroservices();

  await app.listen(configService.get<number>('PORT'), () => {
    console.log(
      '\x1b[36m%s\x1b[0m',
      `Hio-API-Gateway start on port: ${configService.get<number>('PORT')}`,
    );
  });
}

bootstrap();
