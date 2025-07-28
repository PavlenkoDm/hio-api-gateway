import { Injectable } from '@nestjs/common';

import { ProjectsQueueService } from '../queue/projects-queue.service';
import {
  CreateProjectDto,
  CreateProjectResponseDto,
} from './projects-dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsQueueService: ProjectsQueueService) {}

  createProject(createProjectDto: CreateProjectDto) {
    return new Promise((resolve, reject) => {
      this.projectsQueueService.queueProjectCreate(createProjectDto).subscribe({
        next: async (createProjectResponseDto: CreateProjectResponseDto) => {
          return resolve(createProjectResponseDto);
        },
        error: (error) => reject(error),
      });
    });
  }
}
