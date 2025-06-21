import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

import { RedisClientName, RedisError } from './redis-constants/redis.constants';
import { SetUserDto } from './redis-dto/set-user.dto';

@Injectable()
export class RedisService {
  constructor(
    @Inject(RedisClientName.RADIS_CACHE)
    private readonly redisClient: RedisClientType,
  ) {}

  async setUser(key: string, value: SetUserDto): Promise<void> {
    try {
      const stringifiedValue = JSON.stringify(value);
      await this.redisClient.set(key, stringifiedValue);
    } catch (error) {
      throw new HttpException(
        RedisError.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUser(key: string): Promise<SetUserDto> {
    try {
      const userData: string = await this.redisClient.get(key);
      return JSON.parse(userData);
    } catch (error) {
      throw new HttpException(
        RedisError.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      throw new HttpException(
        RedisError.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
