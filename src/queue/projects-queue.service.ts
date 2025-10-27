import { HttpException, Inject, Injectable } from '@nestjs/common';
import { catchError, retry, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

import {
  ProjectsQueueEvents,
  QueueClientsNames,
} from './constants/queue.constants';
import {
  CreateProjectDto,
  TeamMemberDto,
} from '../projects/projects-dto/create-project.dto';
import { StartProjectDto } from '../projects/projects-dto/start-project.dto';

@Injectable()
export class ProjectsQueueService {
  constructor(
    @Inject(QueueClientsNames.PROJECTS_QUEUE_CLIENT)
    private readonly projectsQueueClient: ClientProxy,
  ) {}

  queueProjectCreate(createProjectDto: CreateProjectDto) {
    return this.projectsQueueSender(
      ProjectsQueueEvents.CREATE_PROJECT,
      createProjectDto,
    );
  }

  queueProjectDelete(id: number) {
    return this.projectsQueueSender(ProjectsQueueEvents.DELETE_PROJECT_BY_ID, {
      id,
    });
  }

  queueProjectGet(id: number) {
    return this.projectsQueueSender(ProjectsQueueEvents.GET_PROJECT_BY_ID, {
      id,
    });
  }

  queueProjectStart(id: number, startProjectDto: StartProjectDto) {
    return this.projectsQueueSender(ProjectsQueueEvents.START_PROJECT, {
      id,
      startProjectDto,
    });
  }

  queueUpdateProjectMembers(projectId: number, teamMemberDto: TeamMemberDto) {
    return this.projectsQueueSender(
      ProjectsQueueEvents.UPDATE_PROJECT_MEMBERS,
      { projectId, teamMemberDto },
    );
  }

  private projectsQueueSender(keyOfEvent: string, dto: object) {
    const retryAttempts = 5;
    const delay = 1000;
    return this.projectsQueueClient.send({ cmd: keyOfEvent }, dto).pipe(
      retry({
        count: retryAttempts,
        delay: (error, retryCount) => {
          if (
            typeof error === 'string' &&
            error.includes('no matching message handler defined')
          ) {
            console.log(
              `Retrying... attempt ${retryCount}. (no matching message handler defined)`,
            );
            return new Promise((resolve) => setTimeout(resolve, delay));
          }
          if (typeof error === 'object' && error.status) {
            return throwError(
              () => new HttpException(error.message, error.status),
            );
          }

          return throwError(() => new Error(error));
        },
      }),
      catchError((error) => {
        if (typeof error === 'object' && error.status) {
          return throwError(
            () => new HttpException(error.message, error.status),
          );
        }
        return throwError(() => new Error(error));
      }),
    );
  }
}
