import { Inject, Injectable } from '@nestjs/common';

import { QueueService } from '../queue/queue.service';
import { SignUpDto } from './auth-dto/sign-up.dto';
import { SignInDto } from './auth-dto/sign-in.dto';
import { SignOutWithAccessTokenDto } from './auth-dto/sign-out.dto';
import { AuthRefreshDto } from './auth-dto/auth-refresh.dto';

@Injectable()
export class AuthService {
  constructor(@Inject() private readonly queueService: QueueService) {}

  authSignUp(signUpDto: SignUpDto) {
    return this.queueService.queueAuthSignUp(signUpDto);
  }

  authSignIn(signInDto: SignInDto) {
    return this.queueService.queueAuthSignIn(signInDto);
  }

  authSignOut(signOutWithAccessTokenDto: SignOutWithAccessTokenDto) {
    return this.queueService.queueAuthSignOut(signOutWithAccessTokenDto);
  }

  authRefresh(authRefreshDto: AuthRefreshDto) {
    return this.queueService.queueAuthRefresh(authRefreshDto);
  }
}
