import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { ProjectsSwaggerApiResDescription } from '../projects-constants/projects-swagger.constants';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Project_1',
    description: 'Must contain name.',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Must contain description of the project.',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  description: string;
}

export class CreateProjectResponseDto {
  @ApiProperty({
    example: HttpStatus.CREATED,
    description: ProjectsSwaggerApiResDescription.STATUS_CODE,
  })
  status: number;

  @ApiProperty({
    example: ProjectsSwaggerApiResDescription.PROJECT_CREATED,
  })
  message: string;
}
