import { IsNotEmpty, IsEmail, Matches } from 'class-validator';
import {
  emailValidationRegExp,
  ValidationEmailErrMsg,
} from '../auth-constants/auth.constants';
import { ApiProperty } from '@nestjs/swagger';
import { AuthSwaggerEmailConstants } from '../auth-constants/auth-swagger.constants';

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
}
