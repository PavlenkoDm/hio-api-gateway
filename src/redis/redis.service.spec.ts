import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from './redis.service';
import { RedisClientName } from './redis-constants/redis.constants';
import { SetUserDto } from './redis-dto/set-user.dto';

describe('RedisService', () => {
  let service: RedisService;
  const redisClientMock = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        { provide: RedisClientName.RADIS_CACHE, useValue: redisClientMock },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setUser', () => {
    it('should call redisClient.set with correct arguments', async () => {
      const key = 'user:1';
      const setUserDtoMock: SetUserDto = {
        email: 'some.email@mail.com',
        accessToken: ['firstXtoken', 'secondXtoken'],
        refreshToken: ['firstXrfXtoken', 'secondXrfXtoken'],
      };
      await service.setUser(key, setUserDtoMock);

      expect(redisClientMock.set).toHaveBeenCalledWith(
        key,
        JSON.stringify(setUserDtoMock),
      );
    });
  });

  describe('getUser', () => {
    it('should call redisClient.get and return parsed value', async () => {
      const key = 'user:1';
      const expectedValue: SetUserDto = {
        email: 'some.email@mail.com',
        accessToken: ['firstXtoken', 'secondXtoken'],
        refreshToken: ['firstXrfXtoken', 'secondXrfXtoken'],
      };

      redisClientMock.get.mockResolvedValue(JSON.stringify(expectedValue));

      const result = await service.getUser(key);

      expect(redisClientMock.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(expectedValue);
    });
  });

  describe('deleteUser', () => {
    it('should call redisClient.del with correct key', async () => {
      const key = 'user:1';
      await service.deleteUser(key);

      expect(redisClientMock.del).toHaveBeenCalledWith(key);
    });
  });
});
