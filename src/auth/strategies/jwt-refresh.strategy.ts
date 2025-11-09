import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { QueueService } from '../../queue/queue.service';
import { UserInJwtStrategyDto } from '../auth-dto/user.dto';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject() private readonly queueService: QueueService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: { id: string }) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    try {
      const userInRedisCache = await this.redisService.getUser(payload.id);

      if (userInRedisCache) {
        const accessSecret =
          this.configService.get<string>('JWT_ACCESS_SECRET');

        const validAccessTokens = this.validateTokens(
          userInRedisCache.accessToken,
          accessSecret,
        );

        const tokenIndex = userInRedisCache.refreshToken.indexOf(token);
        if (tokenIndex !== -1) {
          userInRedisCache.refreshToken.splice(tokenIndex, 1);
        }

        const userToSetInCache = {
          email: userInRedisCache.email,
          accessToken: validAccessTokens,
          refreshToken: userInRedisCache.refreshToken,
        };

        await this.redisService.setUser(payload.id, userToSetInCache);
      }
    } catch (error) {
      console.error('RedisError(jwt-refresh): ', error);
    }

    return new Promise((resolve, reject) => {
      this.queueService
        .queueAuthJwtRefreshGuard({ ...payload, refreshToken: token })
        .subscribe({
          next: (authenticatedUser: UserInJwtStrategyDto) => {
            if (!authenticatedUser) {
              return resolve(null);
            }
            return resolve({
              ...authenticatedUser,
              refreshToken: token,
            });
          },
          error: (error) => reject(error),
        });
    });
  }

  private validateTokens(arrOfTokens: string[], jwtSecret: string) {
    const validTokens = arrOfTokens.filter((token: string) => {
      try {
        this.jwtService.verify(token, {
          secret: jwtSecret,
        });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    });
    return validTokens;
  }
}
