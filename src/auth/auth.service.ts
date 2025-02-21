import { Inject, Injectable } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { SignUpDto } from './auth-dto/sign-up.dto';
import { SignInDto } from './auth-dto/sign-in.dto';
import { SignOutDto } from './auth-dto/sign-out.dto';

@Injectable()
export class AuthService {
  constructor(@Inject() private readonly queueService: QueueService) {}

  async authSignUp(signUpDto: SignUpDto) {
    return await this.queueService.queueAuthSignUp(signUpDto);
  }

  async authSignIn(signInDto: SignInDto) {
    return await this.queueService.queueAuthSignIn(signInDto);
  }

  async authSignOut(signOutDto: SignOutDto) {
    return await this.queueService.queueAuthSignOut(signOutDto);
  }
}
