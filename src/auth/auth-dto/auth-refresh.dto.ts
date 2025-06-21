import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  AuthSwaggerApiResponseDescription,
  //AuthSwaggerEmailConstants,
} from '../auth-constants/auth-swagger.constants';
import { HttpStatus } from '@nestjs/common';

export class AuthRefreshDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class TokensDto {
  // @ApiProperty({
  //   description: AuthSwaggerApiResponseDescription.MONGO_ID,
  // })
  // id: string;

  // @ApiProperty({
  //   example: AuthSwaggerEmailConstants.EXAMPLE,
  //   description: AuthSwaggerEmailConstants.DESCRIPTION,
  // })
  // email: string;

  @ApiProperty({
    description: AuthSwaggerApiResponseDescription.USER_ACCESS_TOKEN,
  })
  accessToken: string;

  @ApiProperty({
    description: AuthSwaggerApiResponseDescription.USER_REFRESH_TOKEN,
  })
  refreshToken: string;
}

export class AuthRefreshResponseDto {
  @ApiProperty({
    example: HttpStatus.OK,
    description: AuthSwaggerApiResponseDescription.STATUS_CODE,
  })
  status: number;

  @ApiProperty({
    example: AuthSwaggerApiResponseDescription.USER_TOKENS_UPDATED,
    description: AuthSwaggerApiResponseDescription.TOKENS_UPDATED,
  })
  message: string;

  @ApiProperty({
    description: AuthSwaggerApiResponseDescription.UPDATED_TOKENS,
    type: TokensDto,
  })
  tokens: TokensDto;
}
