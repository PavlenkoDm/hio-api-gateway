//import { HttpStatus } from '@nestjs/common';
//import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsBoolean,
  IsInt,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsDateString,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

//import { ProjectsSwaggerApiResDescription } from '../projects-constants/projects-swagger.constants';

import {
  ComplexityType,
  DomainType,
  ProjectStatus,
  ProjectType,
  TeamRole,
  UserStatus,
  WorkDirection,
} from '../projects-constants/project.constants';

// export class CreateProjectDto {
//   @ApiProperty({
//     example: 'Project_1',
//     description: 'Must contain name.',
//     type: String,
//     required: true,
//   })
//   @IsNotEmpty()
//   @MinLength(3)
//   @MaxLength(100)
//   name: string;

//   @ApiProperty({
//     description: 'Must contain description of the project.',
//     type: String,
//     required: true,
//   })
//   @IsNotEmpty()
//   @MinLength(10)
//   @MaxLength(200)
//   description: string;
// }

// export class CreateProjectResponseDto {
//   @ApiProperty({
//     example: HttpStatus.CREATED,
//     description: ProjectsSwaggerApiResDescription.STATUS_CODE,
//   })
//   status: number;

//   @ApiProperty({
//     example: ProjectsSwaggerApiResDescription.PROJECT_CREATED,
//   })
//   message: string;
// }

// Nested DTO
export class StartTaskDto {
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @IsBoolean()
  isCompleted: boolean = false;
}

export class StartLanguageDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  label: string;
}

export class StartTeamMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsBoolean()
  mentorship: boolean = false;

  @IsEnum(TeamRole)
  role: TeamRole;

  @IsArray()
  @IsEnum(WorkDirection, { each: true })
  directions: WorkDirection[];

  @IsEnum(UserStatus)
  status: UserStatus;
}

// basics section
export class StartBasicsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  goals: string;

  @IsEnum(DomainType)
  domain: DomainType;

  // @IsString()
  // @IsNotEmpty()
  // domainSlug: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  stack: string[];

  @IsEnum(ProjectType)
  type: ProjectType;

  @IsArray()
  @ArrayMinSize(3)
  @ValidateNested({ each: true })
  @Type(() => StartTaskDto)
  tasks: StartTaskDto[];
}

// team section
export class StartTeamDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StartLanguageDto)
  language: StartLanguageDto[];

  @IsObject()
  teamSize: Record<string, number>;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StartTeamMemberDto)
  members: StartTeamMemberDto[];
}

// publish section
export class StartPublishDto {
  @IsEnum(ComplexityType)
  complexity: ComplexityType;

  @IsInt()
  @Min(1)
  @Max(24)
  duration: number;
}

// Main DTO
export class StartProjectDto {
  @ValidateNested()
  @Type(() => StartBasicsDto)
  basics: StartBasicsDto;

  @ValidateNested()
  @Type(() => StartTeamDto)
  team: StartTeamDto;

  @ValidateNested()
  @Type(() => StartPublishDto)
  publish: StartPublishDto;
}

//======================================================================

//Response
export class StartBasicsResponseDto {
  @IsInt()
  @Min(1)
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @MinLength(1)
  @IsString()
  goals: string;

  @IsEnum(DomainType)
  domain: DomainType;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  stack: string[];

  @IsEnum(ProjectType)
  type: ProjectType;

  @IsArray()
  @ArrayMinSize(3)
  @ValidateNested({ each: true })
  @Type(() => StartTaskDto)
  tasks: StartTaskDto[];
}

export class StartPublishResponseDto {
  @IsEnum(ComplexityType)
  complexity: ComplexityType;

  @IsInt()
  @Min(1)
  @Max(24)
  duration: number;
}

export class StartProjectResponseDto {
  @ValidateNested()
  @Type(() => StartBasicsResponseDto)
  basics: StartBasicsResponseDto;

  @ValidateNested()
  @Type(() => StartTeamDto)
  team: StartTeamDto;

  @ValidateNested()
  @Type(() => StartPublishResponseDto)
  publish: StartPublishResponseDto;

  @IsEnum(ProjectStatus)
  projectStatus: ProjectStatus;

  @IsNotEmpty()
  @IsDateString()
  createdAt: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  deadline: string;

  @IsOptional()
  @IsDateString()
  frozenDate?: string | null;
}
