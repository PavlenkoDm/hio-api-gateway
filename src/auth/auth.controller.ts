import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignUpDto, SignUpResponseDto } from './auth-dto/sign-up.dto';
import { SignInDto, SignInResponseDto } from './auth-dto/sign-in.dto';
import { SignOutDto } from './auth-dto/sign-out.dto';
import { AuthSwaggerApiResponseDescription } from './auth-constants/auth-swagger.constants';
import { JwtAuthGuard } from './guards/jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AuthSwaggerApiResponseDescription.SUCCESSFUL_REGISTRATION,
    type: SignUpResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: AuthSwaggerApiResponseDescription.VALIDATION_ERROR,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: AuthSwaggerApiResponseDescription.EMAIL_IN_USE,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: AuthSwaggerApiResponseDescription.SERVER_ERROR,
  })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.authSignUp(signUpDto);
  }

  @HttpCode(200)
  @Post('signin')
  @ApiOperation({ summary: 'Sign-in user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: AuthSwaggerApiResponseDescription.SUCCESSFUL_AUTH,
    type: SignInResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: AuthSwaggerApiResponseDescription.VALIDATION_ERROR,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthSwaggerApiResponseDescription.UNAUTHORISED,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: AuthSwaggerApiResponseDescription.SERVER_ERROR,
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.authSignIn(signInDto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('signout')
  @ApiOperation({ summary: 'Sign-out user' })
  @ApiBearerAuth()
  @ApiSecurity('bearer')
  @ApiResponse({
    status: HttpStatus.OK,
    description: AuthSwaggerApiResponseDescription.SUCCESSFUL_SIGNOUT,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: AuthSwaggerApiResponseDescription.VALIDATION_ERROR,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthSwaggerApiResponseDescription.UNAUTHORISED,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: AuthSwaggerApiResponseDescription.SERVER_ERROR,
  })
  signOut(
    @Request() req: { user: { email: string; accessToken: string } },
    @Body() signOutDto: SignOutDto,
  ) {
    return this.authService.authSignOut({
      ...signOutDto,
      accessToken: req.user.accessToken,
    });
  }
}
