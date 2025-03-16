import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { QueueService } from '../../queue/queue.service';
import { UserInJwtStrategyDto } from '../auth-dto/user.dto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject() private readonly queueService: QueueService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: { id: string }) {
    return new Promise((resolve, reject) => {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

      this.queueService
        .queueAuthJwtRefreshGuard({ ...payload, refreshToken: token })
        .subscribe({
          next: (authenticatedUser: UserInJwtStrategyDto) => {
            if (!authenticatedUser) {
              return resolve(null);
            }
            return resolve({ ...authenticatedUser, refreshToken: token });
          },
          error: (err) => reject(err),
        });
    });
  }
}
