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
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  ComplexityType,
  DomainType,
  ProjectStatus,
  ProjectType,
  TeamRole,
  UserStatus,
  WorkDirection,
} from '../projects-constants/project.constants';
import { IsSafeInput } from '../../common/validators/is-safe-input.decorator';
import { ProjectsApiExample } from '../projects-constants/projects-swagger.constants';

// ─────────────────────────────────────────────────────────────
// Nested DTOs
// ─────────────────────────────────────────────────────────────

export class StartTaskDto {
  @ApiProperty({
    description: 'Unique task identifier (UUID)',
    example: ProjectsApiExample.TASK_ID,
  })
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @ApiProperty({
    description: 'Task title',
    example: ProjectsApiExample.TASK_TITLE,
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  @IsSafeInput()
  title: string;

  @ApiProperty({
    description: 'Whether the task is completed',
    example: false,
    default: false,
  })
  @IsBoolean()
  isCompleted: boolean = false;
}

export class StartLanguageDto {
  @ApiProperty({
    description: 'ISO 639-1 language code',
    example: ProjectsApiExample.LANGUAGE_CODE,
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Human-readable language name',
    example: ProjectsApiExample.LANGUAGE_LABEL,
  })
  @IsString()
  @IsNotEmpty()
  label: string;
}

export class StartTeamMemberDto {
  @ApiProperty({
    description: 'User unique identifier (UUID)',
    example: ProjectsApiExample.USER_ID,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Full name of the team member',
    example: ProjectsApiExample.MEMBER_NAME,
    minLength: 5,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsSafeInput()
  name: string;

  @ApiPropertyOptional({
    description: 'URL to member avatar image',
    example: ProjectsApiExample.AVATAR_URL,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    description: 'Whether this member offers mentorship',
    example: false,
    default: false,
  })
  @IsBoolean()
  mentorship: boolean = false;

  @ApiProperty({
    description: 'Role of the member in the project',
    enum: TeamRole,
    example: TeamRole.OWNER,
  })
  @IsEnum(TeamRole)
  role: TeamRole;

  @ApiProperty({
    description: 'Work directions of the member',
    enum: WorkDirection,
    isArray: true,
    example: [WorkDirection.BACKEND_DEVELOPER],
  })
  @IsArray()
  @IsEnum(WorkDirection, { each: true })
  directions: WorkDirection[];

  @ApiProperty({
    description: 'Current status of the member',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus)
  status: UserStatus;
}

// ─────────────────────────────────────────────────────────────
// Sections DTOs
// ─────────────────────────────────────────────────────────────

export class StartBasicsDto {
  @ApiProperty({
    description: 'Project name',
    example: ProjectsApiExample.PROJECT_NAME,
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @IsSafeInput()
  name: string;

  @ApiProperty({
    description: 'Detailed project description',
    example: ProjectsApiExample.PROJECT_DESCRIPTION,
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  @IsSafeInput()
  description: string;

  @ApiProperty({
    description: 'Project goals and expected outcomes',
    example: ProjectsApiExample.PROJECT_GOALS,
    minLength: 10,
    maxLength: 1000,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  @IsSafeInput()
  goals: string;

  @ApiProperty({
    description: 'Project domain / industry',
    enum: DomainType,
    example: DomainType.WEB_DEVELOPMENT,
  })
  @IsEnum(DomainType)
  domain: DomainType;

  @ApiProperty({
    description: 'Technology stack — at least one item required',
    type: [String],
    example: ['React', 'NestJS', 'PostgreSQL'],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  stack: string[];

  @ApiProperty({
    description: 'Project type',
    enum: ProjectType,
    example: ProjectType.DEFAULT,
  })
  @IsEnum(ProjectType)
  type: ProjectType;

  @ApiProperty({
    description: 'Project tasks — minimum 3 required to start',
    type: [StartTaskDto],
    minItems: 3,
  })
  @IsArray()
  @ArrayMinSize(3)
  @ValidateNested({ each: true })
  @Type(() => StartTaskDto)
  tasks: StartTaskDto[];
}

export class StartTeamDto {
  @ApiProperty({
    description: 'Languages spoken in the team — at least one required',
    type: [StartLanguageDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StartLanguageDto)
  language: StartLanguageDto[];

  @ApiProperty({
    description: 'Required team size per role',
    example: { 'frontend developer': 2, 'backend developer': 1 },
  })
  @IsObject()
  teamSize: Record<string, number>;

  @ApiProperty({
    description: 'Team members — at least one required to start',
    type: [StartTeamMemberDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StartTeamMemberDto)
  members: StartTeamMemberDto[];
}

export class StartPublishDto {
  @ApiProperty({
    description: 'Project complexity level',
    enum: ComplexityType,
    example: ComplexityType.MEDIUM,
  })
  @IsEnum(ComplexityType)
  complexity: ComplexityType;

  @ApiProperty({
    description: 'Expected project duration in months (min 1)',
    minimum: 1,
    maximum: 24,
    example: 3,
  })
  @IsInt()
  @Min(1)
  @Max(24)
  duration: number;
}

// ─────────────────────────────────────────────────────────────
// Main Request DTO
// ─────────────────────────────────────────────────────────────

export class StartProjectDto {
  @ApiProperty({
    description: 'Basic project information',
    type: () => StartBasicsDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => StartBasicsDto)
  basics: StartBasicsDto;

  @ApiProperty({
    description: 'Team configuration',
    type: () => StartTeamDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => StartTeamDto)
  team: StartTeamDto;

  @ApiProperty({
    description: 'Publishing settings',
    type: () => StartPublishDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => StartPublishDto)
  publish: StartPublishDto;
}

// ─────────────────────────────────────────────────────────────
// Response DTOs
// ─────────────────────────────────────────────────────────────

export class StartBasicsResponseDto {
  @ApiProperty({ description: 'Project unique identifier', example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: ProjectsApiExample.PROJECT_NAME })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: ProjectsApiExample.PROJECT_DESCRIPTION })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: ProjectsApiExample.PROJECT_GOALS })
  @IsString()
  goals: string;

  @ApiProperty({ enum: DomainType, example: DomainType.WEB_DEVELOPMENT })
  @IsEnum(DomainType)
  domain: DomainType;

  @ApiProperty({ type: [String], example: ['React', 'NestJS'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  stack: string[];

  @ApiProperty({ enum: ProjectType, example: ProjectType.DEFAULT })
  @IsEnum(ProjectType)
  type: ProjectType;

  @ApiProperty({ type: [StartTaskDto] })
  @IsArray()
  @ArrayMinSize(3)
  @ValidateNested({ each: true })
  @Type(() => StartTaskDto)
  tasks: StartTaskDto[];
}

export class StartPublishResponseDto {
  @ApiProperty({ enum: ComplexityType, example: ComplexityType.MEDIUM })
  @IsEnum(ComplexityType)
  complexity: ComplexityType;

  @ApiProperty({ minimum: 1, maximum: 24, example: 3 })
  @IsInt()
  @Min(1)
  @Max(24)
  duration: number;
}

export class StartProjectResponseDto {
  @ApiProperty({ type: () => StartBasicsResponseDto })
  @ValidateNested()
  @Type(() => StartBasicsResponseDto)
  basics: StartBasicsResponseDto;

  @ApiProperty({ type: () => StartTeamDto })
  @ValidateNested()
  @Type(() => StartTeamDto)
  team: StartTeamDto;

  @ApiProperty({ type: () => StartPublishResponseDto })
  @ValidateNested()
  @Type(() => StartPublishResponseDto)
  publish: StartPublishResponseDto;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.ACTIVE })
  @IsEnum(ProjectStatus)
  projectStatus: ProjectStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  createdAt: string;

  @ApiProperty({
    description: 'Date when project was started',
    example: '2024-06-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Calculated project deadline based on duration',
    example: '2024-09-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  deadline: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsDateString()
  frozenDate?: string | null;
}
