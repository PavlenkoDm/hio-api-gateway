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

export class TaskDto {
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

export class LanguageDto {
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

export class TeamMemberDto {
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
    example: TeamRole.USER,
  })
  @IsEnum(TeamRole)
  role: TeamRole;

  @ApiProperty({
    description: 'Work directions of the member',
    enum: WorkDirection,
    isArray: true,
    example: [WorkDirection.FRONTEND_DEVELOPER],
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

export class BasicsDto {
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
    description: 'Technology stack used in the project',
    type: [String],
    example: ['React', 'NestJS', 'PostgreSQL'],
  })
  @IsArray()
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
    description: 'List of project tasks',
    type: [TaskDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks: TaskDto[];
}

export class TeamDto {
  @ApiProperty({
    description: 'Languages spoken in the team',
    type: [LanguageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  language: LanguageDto[];

  @ApiProperty({
    description: 'Required team size per role',
    example: { 'frontend developer': 2, 'backend developer': 1 },
  })
  @IsObject()
  teamSize: Record<string, number>;

  @ApiProperty({
    description: 'Current team members',
    type: [TeamMemberDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  members: TeamMemberDto[];
}

export class PublishDto {
  @ApiProperty({
    description: 'Project complexity level',
    enum: ComplexityType,
    example: ComplexityType.MEDIUM,
  })
  @IsEnum(ComplexityType)
  complexity: ComplexityType;

  @ApiProperty({
    description: 'Expected project duration in months (0 = no deadline)',
    minimum: 0,
    maximum: 24,
    example: 3,
  })
  @IsInt()
  @Min(0)
  @Max(24)
  duration: number;
}

// ─────────────────────────────────────────────────────────────
// Main Request DTO
// ─────────────────────────────────────────────────────────────

export class CreateProjectDto {
  @ApiProperty({
    description: 'Basic project information',
    type: () => BasicsDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => BasicsDto)
  basics: BasicsDto;

  @ApiProperty({
    description: 'Team configuration',
    type: () => TeamDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => TeamDto)
  team: TeamDto;

  @ApiProperty({
    description: 'Publishing settings',
    type: () => PublishDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => PublishDto)
  publish: PublishDto;
}

// ─────────────────────────────────────────────────────────────
// Response DTOs
// ─────────────────────────────────────────────────────────────

export class BasicsResponseDto {
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
  @IsString({ each: true })
  stack: string[];

  @ApiProperty({ enum: ProjectType, example: ProjectType.DEFAULT })
  @IsEnum(ProjectType)
  type: ProjectType;

  @ApiProperty({ type: [TaskDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks: TaskDto[];
}

export class PublishResponseDto {
  @ApiPropertyOptional({ enum: ComplexityType })
  @IsOptional()
  @IsEnum(ComplexityType)
  complexity?: ComplexityType;

  @ApiPropertyOptional({ minimum: 1, maximum: 24 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(24)
  duration?: number;
}

export class ProjectResponseDto {
  @ApiProperty({ type: () => BasicsResponseDto })
  @ValidateNested()
  @Type(() => BasicsResponseDto)
  basics: BasicsResponseDto;

  @ApiProperty({ type: () => TeamDto })
  @ValidateNested()
  @Type(() => TeamDto)
  team: TeamDto;

  @ApiProperty({ type: () => PublishResponseDto })
  @ValidateNested()
  @Type(() => PublishResponseDto)
  publish: PublishResponseDto;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.CREATED })
  @IsEnum(ProjectStatus)
  projectStatus: ProjectStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @IsDateString()
  createdAt: string;

  @ApiPropertyOptional({ example: '2024-06-01T00:00:00.000Z', nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: string | null;

  @ApiPropertyOptional({ example: '2024-09-01T00:00:00.000Z', nullable: true })
  @IsOptional()
  @IsDateString()
  deadline?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsDateString()
  frozenDate?: string | null;
}
