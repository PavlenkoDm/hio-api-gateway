import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { QueueClientsNames } from './constants/queue.constants';

describe('QueueService', () => {
  let service: QueueService;
  const authQueueClientMock = {
    queueAuthSignUp: jest.fn(),
    queueAuthSignIn: jest.fn(),
    queueAuthSignOut: jest.fn(),
    queueAuthJwtGuard: jest.fn(),
    queueAuthJwtRefreshGuard: jest.fn(),
    queueAuthRefresh: jest.fn(),
    authQueueSender: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: QueueClientsNames.AUTH_QUEUE_CLIENT,
          useValue: authQueueClientMock,
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
