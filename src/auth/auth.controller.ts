import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './auth-dto/sign-up.dto';
import { SignInDto } from './auth-dto/sign-in.dto';
import { SignOutDto } from './auth-dto/sign-out.dto';
import { AuthSwaggerApiResponseDescription } from './auth-constants/auth-swagger.constants';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: AuthSwaggerApiResponseDescription.SUCCESSFUL_REGISTRATION,
  })
  @ApiResponse({
    status: 400,
    description: AuthSwaggerApiResponseDescription.VALIDATION_ERROR,
  })
  @ApiResponse({
    status: 500,
    description: AuthSwaggerApiResponseDescription.SERVER_ERROR,
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.authSignUp(signUpDto);
  }

  @HttpCode(200)
  @Post('signin')
  @ApiOperation({ summary: 'Sign-in user' })
  @ApiResponse({
    status: 200,
    description: AuthSwaggerApiResponseDescription.SUCCESSFUL_AUTH,
  })
  @ApiResponse({
    status: 400,
    description: AuthSwaggerApiResponseDescription.VALIDATION_ERROR,
  })
  @ApiResponse({
    status: 401,
    description: AuthSwaggerApiResponseDescription.UNAUTHORISED,
  })
  @ApiResponse({
    status: 500,
    description: AuthSwaggerApiResponseDescription.SERVER_ERROR,
  })
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.authSignIn(signInDto);
  }

  @HttpCode(200)
  @Post('signout')
  @ApiOperation({ summary: 'Sign-out user' })
  @ApiResponse({
    status: 200,
    description: AuthSwaggerApiResponseDescription.SUCCESSFUL_SIGNOUT,
  })
  @ApiResponse({
    status: 400,
    description: AuthSwaggerApiResponseDescription.VALIDATION_ERROR,
  })
  @ApiResponse({
    status: 404,
    description: AuthSwaggerApiResponseDescription.USER_NOT_FOUND,
  })
  @ApiResponse({
    status: 500,
    description: AuthSwaggerApiResponseDescription.SERVER_ERROR,
  })
  async signOut(@Body() signOutDto: SignOutDto) {
    return await this.authService.authSignOut(signOutDto);
  }
}
