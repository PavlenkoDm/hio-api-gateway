import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { GlobalExceptionFilter } from './exception-filters/global-exception.filter';
//import { RedisModule } from './redis/redis.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    //AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    QueueModule,
    //RedisModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
