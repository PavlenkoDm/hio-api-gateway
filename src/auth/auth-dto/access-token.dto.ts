import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  accToken: string;
}
