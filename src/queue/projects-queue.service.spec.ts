import { Test, TestingModule } from '@nestjs/testing';

import { ProjectsQueueService } from './projects-queue.service';

describe('ProjectQueueService', () => {
  let service: ProjectsQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsQueueService],
    }).compile();

    service = module.get<ProjectsQueueService>(ProjectsQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
