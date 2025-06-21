import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

import { RedisService } from './redis.service';
import { RedisClientName } from './redis-constants/redis.constants';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: RedisClientName.RADIS_CACHE,
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URI');
        const client = createClient({
          url: redisUrl,
          socket: {
            reconnectStrategy: (retries: number = 1) => {
              console.log(`Retry to connect Redis (retries: ${retries})`);
              return Math.min(retries * 100, 3000);
            },
            keepAlive: 4000,
          },
        });

        client.on('error', (error) => console.log('Redis Client Error', error));

        await client.connect();

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
