import { HttpException, Inject, Injectable } from '@nestjs/common';
import { catchError, retry, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

import {
  AuthQueueEvents,
  QueueClientsNames,
  QueueErrors,
} from './constants/queue.constants';
import { SignUpDto } from '../auth/auth-dto/sign-up.dto';
import { SignInDto } from '../auth/auth-dto/sign-in.dto';
import { SignOutWithAccessTokenDto } from '../auth/auth-dto/sign-out.dto';
import { AccessTokenDto } from '../auth/auth-dto/access-token.dto';

@Injectable()
export class QueueService {
  constructor(
    @Inject(QueueClientsNames.AUTH_QUEUE_CLIENT)
    private readonly authQueueClient: ClientProxy,
  ) {}

  queueAuthSignUp(signUpDto: SignUpDto) {
    const retryAttempts = 3;
    const delay = 1000;
    return this.authQueueClient
      .send({ cmd: AuthQueueEvents.SIGN_UP }, signUpDto)
      .pipe(
        retry({
          count: retryAttempts,
          delay: (error, retryCount) => {
            if (
              typeof error === 'string' &&
              error.includes(QueueErrors.HANDLER_NOT_DEFINED)
            ) {
              console.log(
                `Retrying... attempt ${retryCount}. (${QueueErrors.HANDLER_NOT_DEFINED})`,
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

  queueAuthSignIn(signInDto: SignInDto) {
    const retryAttempts = 3;
    const delay = 1000;
    return this.authQueueClient
      .send({ cmd: AuthQueueEvents.SIGN_IN }, signInDto)
      .pipe(
        retry({
          count: retryAttempts,
          delay: (error, retryCount) => {
            if (
              typeof error === 'string' &&
              error.includes(QueueErrors.HANDLER_NOT_DEFINED)
            ) {
              console.log(
                `Retrying... attempt ${retryCount}. (${QueueErrors.HANDLER_NOT_DEFINED})`,
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

  queueAuthSignOut(signOutWithAccessTokenDto: SignOutWithAccessTokenDto) {
    const retryAttempts = 3;
    const delay = 1000;
    return this.authQueueClient
      .send({ cmd: AuthQueueEvents.SIGN_OUT }, signOutWithAccessTokenDto)
      .pipe(
        retry({
          count: retryAttempts,
          delay: (error, retryCount) => {
            if (
              typeof error === 'string' &&
              error.includes(QueueErrors.HANDLER_NOT_DEFINED)
            ) {
              console.log(
                `Retrying... attempt ${retryCount}. (${QueueErrors.HANDLER_NOT_DEFINED})`,
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

  queueAuthJwtGuard(accessTokenDto: AccessTokenDto) {
    const retryAttempts = 3;
    const delay = 1000;
    return this.authQueueClient
      .send({ cmd: AuthQueueEvents.JWT_GUARD }, accessTokenDto)
      .pipe(
        retry({
          count: retryAttempts,
          delay: (error, retryCount) => {
            if (
              typeof error === 'string' &&
              error.includes(QueueErrors.HANDLER_NOT_DEFINED)
            ) {
              console.log(
                `Retrying... attempt ${retryCount}. (${QueueErrors.HANDLER_NOT_DEFINED})`,
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

  private authQueueSender(key: string, dto: object) {
    const retryAttempts = 2;
    const delay = 1000;
    return this.authQueueClient.send({ cmd: key }, dto).pipe(
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
