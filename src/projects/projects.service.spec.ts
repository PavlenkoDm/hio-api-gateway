import { Test, TestingModule } from '@nestjs/testing';

import { ProjectsService } from './projects.service';
import { ProjectsQueueService } from '../queue/projects-queue.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectsQueueServiceMoc: Partial<ProjectsQueueService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: ProjectsQueueService, useValue: projectsQueueServiceMoc },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
