import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRefreshDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
