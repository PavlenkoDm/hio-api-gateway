import { Injectable } from '@nestjs/common';

import { ProjectsQueueService } from '../queue/projects-queue.service';
import {
  CreateProjectDto,
  ProjectResponseDto,
} from './projects-dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsQueueService: ProjectsQueueService) {}

  createProject(createProjectDto: CreateProjectDto) {
    return new Promise((resolve, reject) => {
      this.projectsQueueService.queueProjectCreate(createProjectDto).subscribe({
        next: async (projectResponseDto: ProjectResponseDto) => {
          return resolve(projectResponseDto);
        },
        error: (error) => reject(error),
      });
    });
  }

  deleteProject(id: number) {
    return new Promise((resolve, reject) => {
      this.projectsQueueService.queueProjectDelete(id).subscribe({
        next: async (projectResponseDto: ProjectResponseDto) => {
          return resolve(projectResponseDto);
        },
        error: (error) => reject(error),
      });
    });
  }

  getProject(id: number) {
    return new Promise((resolve, reject) => {
      this.projectsQueueService.queueProjectGet(id).subscribe({
        next: async (projectResponseDto: ProjectResponseDto) => {
          return resolve(projectResponseDto);
        },
        error: (error) => reject(error),
      });
    });
  }
}
