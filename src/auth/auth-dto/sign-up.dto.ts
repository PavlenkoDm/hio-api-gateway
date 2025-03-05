import {
  IsNotEmpty,
  IsEmail,
  Matches,
  MinLength,
  IsString,
} from 'class-validator';
import {
  emailValidationRegExp,
  passwordMinLength,
  passwordValidationRegExp,
  ValidationEmailErrMsg,
  ValidationPasswordErrMsg,
} from '../auth-constants/auth.constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  AuthSwaggerApiResponseDescription,
  AuthSwaggerEmailConstants,
  AuthSwaggerPasswordConstants,
} from '../auth-constants/auth-swagger.constants';
import { HttpStatus } from '@nestjs/common';

export class SignUpDto {
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

export class SignUpResponseDto {
  @ApiProperty({
    example: HttpStatus.CREATED,
    description: AuthSwaggerApiResponseDescription.STATUS_CODE,
  })
  status: number;

  @ApiProperty({
    example: AuthSwaggerApiResponseDescription.USER_CREATED,
    description: AuthSwaggerApiResponseDescription.SUCCESSFUL_REGISTRATION,
  })
  message: string;
}
