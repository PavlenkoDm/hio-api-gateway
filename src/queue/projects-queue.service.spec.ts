import { Test, TestingModule } from '@nestjs/testing';

import { ProjectsQueueService } from './projects-queue.service';
import { QueueClientsNames } from './constants/queue.constants';

describe('ProjectQueueService', () => {
  let service: ProjectsQueueService;
  const projectsQueueClientMoc = {
    projectsQueueSender: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsQueueService,
        {
          provide: QueueClientsNames.PROJECTS_QUEUE_CLIENT,
          useValue: projectsQueueClientMoc,
        },
      ],
    }).compile();

    service = module.get<ProjectsQueueService>(ProjectsQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
