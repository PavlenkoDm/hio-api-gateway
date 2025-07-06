import { Injectable } from '@nestjs/common';
import { ProjectsQueueService } from '../queue/projects-queue.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsQueueService: ProjectsQueueService) {}

  createProject() {
    return new Promise((resolve, reject) => {
      this.projectsQueueService.queueProjectCreate({}).subscribe({
        next: async ({}) => {
          return resolve({});
        },
        error: (error) => reject(error),
      });
    });
  }
}
