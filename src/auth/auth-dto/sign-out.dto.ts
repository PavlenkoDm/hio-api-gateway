import { IsNotEmpty, IsEmail, Matches, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  emailValidationRegExp,
  ValidationEmailErrMsg,
} from '../auth-constants/auth.constants';
import {
  AuthSwaggerEmailConstants,
  AuthSwaggerTokenConstants,
} from '../auth-constants/auth-swagger.constants';

export class SignOutDto {
  @ApiProperty({
    example: AuthSwaggerEmailConstants.EXAMPLE,
    description: AuthSwaggerEmailConstants.DESCRIPTION,
    type: String,
    format: 'email',
    required: true,
  })
  @IsNotEmpty({ message: ValidationEmailErrMsg.EMPTY_EMAIL })
  @IsEmail({}, { message: ValidationEmailErrMsg.NOT_VALID_EMAIL })
  @Matches(emailValidationRegExp, {
    message: ValidationEmailErrMsg.NOT_CORRECT_EMAIL_FORMAT,
  })
  email: string;

  @ApiProperty({
    example: AuthSwaggerTokenConstants.MONGO_TOKEN_EXAMPLE,
    description: AuthSwaggerTokenConstants.DESCRIPTION,
    type: String,
    required: true,
  })
  @IsString()
  refreshToken: string;
}

export class SignOutWithAccessTokenDto {
  @IsNotEmpty({ message: ValidationEmailErrMsg.EMPTY_EMAIL })
  @IsEmail({}, { message: ValidationEmailErrMsg.NOT_VALID_EMAIL })
  @Matches(emailValidationRegExp, {
    message: ValidationEmailErrMsg.NOT_CORRECT_EMAIL_FORMAT,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
