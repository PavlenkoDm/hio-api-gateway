import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { QueueService } from '../../queue/queue.service';
import { UserInJwtStrategyDto } from '../auth-dto/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject() private readonly queueService: QueueService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: { id: string }) {
    return new Promise((resolve, reject) => {
      const extractTokenFunction = ExtractJwt.fromAuthHeaderAsBearerToken();
      const token = extractTokenFunction(req);
      this.queueService
        .queueAuthJwtGuard({ ...payload, accToken: token })
        .subscribe({
          next: (authenticatedUser: UserInJwtStrategyDto) => {
            if (!authenticatedUser) {
              return resolve(null);
            }

            return resolve({ ...authenticatedUser, accessToken: token });
          },
          error: (err) => reject(err),
        });
    });
  }
}
