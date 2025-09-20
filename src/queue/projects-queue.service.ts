import { HttpException, Inject, Injectable } from '@nestjs/common';
import { catchError, retry, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

import {
  ProjectsQueueEvents,
  QueueClientsNames,
} from './constants/queue.constants';
import { CreateProjectDto } from '../projects/projects-dto/create-project.dto';

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
  // queueAuthSignUp(signUpDto: SignUpDto) {
  //   return this.authQueueSender(AuthQueueEvents.SIGN_UP, signUpDto);
  // }

  // queueAuthSignIn(signInDto: SignInDto) {
  //   return this.authQueueSender(AuthQueueEvents.SIGN_IN, signInDto);
  // }

  // queueAuthSignOut(signOutWithAccessTokenDto: SignOutWithAccessTokenDto) {
  //   return this.authQueueSender(
  //     AuthQueueEvents.SIGN_OUT,
  //     signOutWithAccessTokenDto,
  //   );
  // }

  // queueAuthJwtGuard(accessTokenDto: AccessTokenDto) {
  //   const retryAttempts = 3;
  //   const delay = 1000;
  //   return this.authQueueClient
  //     .send({ cmd: AuthQueueEvents.JWT_GUARD }, accessTokenDto)
  //     .pipe(
  //       retry({
  //         count: retryAttempts,
  //         delay: (error, retryCount) => {
  //           if (
  //             typeof error === 'string' &&
  //             error.includes(QueueErrors.HANDLER_NOT_DEFINED)
  //           ) {
  //             console.log(
  //               `Retrying... attempt ${retryCount}. (${QueueErrors.HANDLER_NOT_DEFINED})`,
  //             );
  //             return new Promise((resolve) => setTimeout(resolve, delay));
  //           }
  //           if (typeof error === 'object' && error.status) {
  //             return throwError(
  //               () => new HttpException(error.message, error.status),
  //             );
  //           }

  //           return throwError(() => new Error(error));
  //         },
  //       }),
  //       catchError((error) => {
  //         if (typeof error === 'object' && error.status) {
  //           return throwError(
  //             () => new HttpException(error.message, error.status),
  //           );
  //         }
  //         return throwError(() => new Error(error));
  //       }),
  //     );
  // }

  // queueAuthJwtRefreshGuard(refreshTokenDto: RefreshTokenDto) {
  //   const retryAttempts = 3;
  //   const delay = 1000;
  //   return this.authQueueClient
  //     .send({ cmd: AuthQueueEvents.JWT_REFRESH_GUARD }, refreshTokenDto)
  //     .pipe(
  //       retry({
  //         count: retryAttempts,
  //         delay: (error, retryCount) => {
  //           if (
  //             typeof error === 'string' &&
  //             error.includes(QueueErrors.HANDLER_NOT_DEFINED)
  //           ) {
  //             console.log(
  //               `Retrying... attempt ${retryCount}. (${QueueErrors.HANDLER_NOT_DEFINED})`,
  //             );
  //             return new Promise((resolve) => setTimeout(resolve, delay));
  //           }
  //           if (typeof error === 'object' && error.status) {
  //             return throwError(
  //               () => new HttpException(error.message, error.status),
  //             );
  //           }

  //           return throwError(() => new Error(error));
  //         },
  //       }),
  //       catchError((error) => {
  //         if (typeof error === 'object' && error.status) {
  //           return throwError(
  //             () => new HttpException(error.message, error.status),
  //           );
  //         }
  //         return throwError(() => new Error(error));
  //       }),
  //     );
  // }

  // queueAuthRefresh(authRefreshDto: AuthRefreshDto) {
  //   return this.authQueueSender(AuthQueueEvents.AUTH_REFRESH, authRefreshDto);
  // }

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
