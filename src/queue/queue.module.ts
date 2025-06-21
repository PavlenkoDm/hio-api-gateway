import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { QueueClientsNames, QueueNames } from './constants/queue.constants';
import { QueueService } from './queue.service';
import { ProjectsQueueService } from './projects-queue.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: QueueClientsNames.AUTH_QUEUE_CLIENT,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService): Promise<object> => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_CONNECTION_URL')],
            queue: QueueNames.AUTH,
            queueOptions: {
              durable: true,
              prefetchCount: 1,
            },
          },
        }),
      },
      {
        name: QueueClientsNames.PROJECTS_QUEUE_CLIENT,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService): Promise<object> => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_CONNECTION_URL')],
            queue: QueueNames.PROJECTS,
            queueOptions: {
              durable: true,
              prefetchCount: 1,
            },
          },
        }),
      },
    ]),
  ],
  providers: [QueueService, ProjectsQueueService],
  exports: [QueueService, ProjectsQueueService],
})
export class QueueModule {}
