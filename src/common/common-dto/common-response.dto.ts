import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommonResponseDto {
  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsNotEmpty()
  @IsString()
  message: string;
}
