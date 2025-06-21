import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { QueueService } from '../queue/queue.service';
import { SignUpDto, SignUpResponseDto } from './auth-dto/sign-up.dto';
import { SignInDto, SignInResponseDto } from './auth-dto/sign-in.dto';
import { SignOutWithAccessTokenDto } from './auth-dto/sign-out.dto';
import {
  AuthRefreshDto,
  AuthRefreshResponseDto,
} from './auth-dto/auth-refresh.dto';
import { RedisService } from '../redis/redis.service';
import { CommonResponseDto } from '../common/common-dto/common-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly queueService: QueueService,
    private readonly redisService: RedisService,
    private jwtService: JwtService,
  ) {}

  authSignUp(signUpDto: SignUpDto) {
    return new Promise((resolve, reject) => {
      this.queueService.queueAuthSignUp(signUpDto).subscribe({
        next: async (signUpResponse: SignUpResponseDto) => {
          return resolve(signUpResponse);
        },
        error: (error) => reject(error),
      });
    });
  }

  authSignIn(signInDto: SignInDto) {
    return new Promise((resolve, reject) => {
      this.queueService.queueAuthSignIn(signInDto).subscribe({
        next: async (loggedInUser: SignInResponseDto) => {
          try {
            const userInRedisCache = await this.redisService.getUser(
              loggedInUser.user.id,
            );
            if (userInRedisCache) {
              const { accessToken, refreshToken } = loggedInUser.user;

              userInRedisCache.accessToken.push(accessToken);
              userInRedisCache.refreshToken.push(refreshToken);

              const userUpdatedCacheData = {
                email: userInRedisCache.email,
                accessToken: userInRedisCache.accessToken,
                refreshToken: userInRedisCache.refreshToken,
              };

              await this.redisService.setUser(
                loggedInUser.user.id,
                userUpdatedCacheData,
              );
            } else {
              const { id, email, accessToken, refreshToken } =
                loggedInUser.user;

              const userDataForCache = {
                email,
                accessToken: [accessToken],
                refreshToken: [refreshToken],
              };

              await this.redisService.setUser(id, userDataForCache);
            }
          } catch (error) {
            console.error('RedisError(sign-in): ', error);
          }

          return resolve(loggedInUser);
        },
        error: (error) => reject(error),
      });
    });
  }

  authSignOut(signOutWithAccessTokenDto: SignOutWithAccessTokenDto) {
    return new Promise((resolve, reject) => {
      this.queueService.queueAuthSignOut(signOutWithAccessTokenDto).subscribe({
        next: async (signOutResponse: CommonResponseDto) => {
          try {
            const { id: userId } = this.jwtService.decode(
              signOutWithAccessTokenDto.accessToken,
            );

            const userInRedisCache = await this.redisService.getUser(userId);
            if (userInRedisCache) {
              const accTokenIndex = userInRedisCache.accessToken.indexOf(
                signOutWithAccessTokenDto.accessToken,
              );
              if (accTokenIndex !== -1) {
                userInRedisCache.accessToken.splice(accTokenIndex, 1);
              }

              const refTokenIndex = userInRedisCache.refreshToken.indexOf(
                signOutWithAccessTokenDto.refreshToken,
              );
              if (refTokenIndex !== -1) {
                userInRedisCache.refreshToken.splice(refTokenIndex, 1);
              }

              const userUpdatedCacheData = {
                email: userInRedisCache.email,
                accessToken: userInRedisCache.accessToken,
                refreshToken: userInRedisCache.refreshToken,
              };

              await this.redisService.setUser(userId, userUpdatedCacheData);
            }
          } catch (error) {
            console.error('RedisError(sign-out): ', error);
          }

          return resolve(signOutResponse);
        },
        error: (error) => reject(error),
      });
    });
  }

  authRefresh(authRefreshDto: AuthRefreshDto) {
    return new Promise((resolve, reject) => {
      this.queueService.queueAuthRefresh(authRefreshDto).subscribe({
        next: async (authRefreshResponse: AuthRefreshResponseDto) => {
          try {
            const { accessToken, refreshToken } = authRefreshResponse.tokens;

            const { id: userId } = this.jwtService.decode(accessToken);

            const userInRedisCache = await this.redisService.getUser(userId);
            if (userInRedisCache) {
              const userUpdatedCacheData = {
                email: userInRedisCache.email,
                accessToken: [...userInRedisCache.accessToken, accessToken],
                refreshToken: [...userInRedisCache.refreshToken, refreshToken],
              };

              await this.redisService.setUser(userId, userUpdatedCacheData);
            }
          } catch (error) {
            console.error('RedisError(sign-out): ', error);
          }

          return resolve(authRefreshResponse);
        },
        error: (error) => reject(error),
      });
    });
  }
}
