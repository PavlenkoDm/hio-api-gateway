import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { QueueService } from '../queue/queue.service';
import { RedisService } from '../redis/redis.service';

describe('AuthService', () => {
  let service: AuthService;
  const queueServiceMock = {
    queueAuthSignUp: jest.fn(),
    queueAuthSignIn: jest.fn(),
    queueAuthSignOut: jest.fn(),
    queueAuthRefresh: jest.fn(),
  };
  const redisServiceMock = {
    getUser: jest.fn(),
    setUser: jest.fn(),
  };
  let jwtServiceMock: Partial<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: QueueService, useValue: queueServiceMock },
        { provide: RedisService, useValue: redisServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
