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
import { RefreshTokenDto } from '../auth/auth-dto/refresh-token.dto';
import { AuthRefreshDto } from 'src/auth/auth-dto/auth-refresh.dto';

@Injectable()
export class QueueService {
  constructor(
    @Inject(QueueClientsNames.AUTH_QUEUE_CLIENT)
    private readonly authQueueClient: ClientProxy,
  ) {}

  queueAuthSignUp(signUpDto: SignUpDto) {
    return this.authQueueSender(AuthQueueEvents.SIGN_UP, signUpDto);
  }

  queueAuthSignIn(signInDto: SignInDto) {
    return this.authQueueSender(AuthQueueEvents.SIGN_IN, signInDto);
  }

  queueAuthSignOut(signOutWithAccessTokenDto: SignOutWithAccessTokenDto) {
    return this.authQueueSender(
      AuthQueueEvents.SIGN_OUT,
      signOutWithAccessTokenDto,
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

  queueAuthJwtRefreshGuard(refreshTokenDto: RefreshTokenDto) {
    const retryAttempts = 3;
    const delay = 1000;
    return this.authQueueClient
      .send({ cmd: AuthQueueEvents.JWT_REFRESH_GUARD }, refreshTokenDto)
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

  queueAuthRefresh(authRefreshDto: AuthRefreshDto) {
    return this.authQueueSender(AuthQueueEvents.AUTH_REFRESH, authRefreshDto);
  }

  private authQueueSender(keyOfEvent: string, dto: object) {
    const retryAttempts = 5;
    const delay = 1000;
    return this.authQueueClient.send({ cmd: keyOfEvent }, dto).pipe(
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
