import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  emailValidationRegExp,
  passwordMinLength,
  passwordValidationRegExp,
  ValidationEmailErrMsg,
  ValidationPasswordErrMsg,
} from '../auth-constants/auth.constants';
import {
  AuthSwaggerApiResponseDescription,
  AuthSwaggerEmailConstants,
  AuthSwaggerPasswordConstants,
} from '../auth-constants/auth-swagger.constants';
import { HttpStatus } from '@nestjs/common';

export class SignInDto {
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
    example: AuthSwaggerPasswordConstants.EXAMPLE,
    description: AuthSwaggerPasswordConstants.DESCRIPTION,
    type: String,
    minLength: passwordMinLength,
    required: true,
  })
  @IsString({ message: ValidationPasswordErrMsg.PASSWORD_IS_NOT_STRING })
  @IsNotEmpty({ message: ValidationPasswordErrMsg.EMPTY_PASSWORD })
  @MinLength(passwordMinLength, {
    message: ValidationPasswordErrMsg.PASSWORD_MIN_LENGTH,
  })
  @Matches(passwordValidationRegExp.upperCaseLetter, {
    message: ValidationPasswordErrMsg.NO_UPPERCASE_LETTER,
  })
  @Matches(passwordValidationRegExp.lowerCaseLetter, {
    message: ValidationPasswordErrMsg.NO_LOWERCASE_LETTER,
  })
  @Matches(passwordValidationRegExp.number, {
    message: ValidationPasswordErrMsg.NO_NUMBER,
  })
  @Matches(passwordValidationRegExp.specialCharacter, {
    message: ValidationPasswordErrMsg.NO_SPECIAL_CHARACTERS,
  })
  password: string;
}

export class UserDto {
  @ApiProperty({
    description: AuthSwaggerApiResponseDescription.MONGO_ID,
  })
  id: string;

  @ApiProperty({
    example: AuthSwaggerEmailConstants.EXAMPLE,
    description: AuthSwaggerEmailConstants.DESCRIPTION,
  })
  email: string;

  @ApiProperty({
    description: AuthSwaggerApiResponseDescription.USER_ACCESS_TOKEN,
  })
  accessToken: string;

  @ApiProperty({
    description: AuthSwaggerApiResponseDescription.USER_REFRESH_TOKEN,
  })
  refreshToken: string;
}

export class SignInResponseDto {
  @ApiProperty({
    example: HttpStatus.OK,
    description: AuthSwaggerApiResponseDescription.STATUS_CODE,
  })
  status: number;

  @ApiProperty({
    example: AuthSwaggerApiResponseDescription.USER_LOGGED_IN,
    description: AuthSwaggerApiResponseDescription.SUCCESSFUL_AUTH,
  })
  message: string;

  @ApiProperty({
    description: AuthSwaggerApiResponseDescription.USER_IN_DB,
    type: UserDto,
  })
  user: UserDto;
}
