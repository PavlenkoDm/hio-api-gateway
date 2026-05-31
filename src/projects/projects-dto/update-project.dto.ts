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
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  ComplexityType,
  DomainType,
  ProjectType,
} from '../projects-constants/project.constants';
import { ProjectsApiExample } from '../projects-constants/projects-swagger.constants';

// ─────────────────────────────────────────────────────────────
// Nested DTOs
// ─────────────────────────────────────────────────────────────

export class TaskDto {
  @ApiPropertyOptional({
    description: 'Unique task identifier (UUID)',
    example: ProjectsApiExample.TASK_ID,
  })
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @ApiPropertyOptional({
    description: 'Task title',
    example: ProjectsApiExample.TASK_TITLE,
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'Whether the task is completed',
    example: false,
    default: false,
  })
  @IsBoolean()
  isCompleted: boolean = false;
}

export class LanguageDto {
  @ApiPropertyOptional({
    description: 'ISO 639-1 language code',
    example: ProjectsApiExample.LANGUAGE_CODE,
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({
    description: 'Human-readable language name',
    example: ProjectsApiExample.LANGUAGE_LABEL,
  })
  @IsString()
  @IsNotEmpty()
  label: string;
}

// ─────────────────────────────────────────────────────────────
// Section DTOs
// Все поля опциональные — обновляем только то что передано
// ─────────────────────────────────────────────────────────────

export class BasicsDto {
  @ApiPropertyOptional({
    description: 'Updated project name',
    example: ProjectsApiExample.PROJECT_NAME,
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated project description',
    example: ProjectsApiExample.PROJECT_DESCRIPTION,
    minLength: 10,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated project goals',
    example: ProjectsApiExample.PROJECT_GOALS,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  goals?: string;

  @ApiPropertyOptional({
    description: 'Updated project domain',
    enum: DomainType,
    example: DomainType.WEB_DEVELOPMENT,
  })
  @IsOptional()
  @IsEnum(DomainType)
  domain?: DomainType;

  @ApiPropertyOptional({
    description: 'Updated technology stack',
    type: [String],
    example: ['Vue', 'FastAPI', 'PostgreSQL'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stack?: string[];

  @ApiPropertyOptional({
    description: 'Updated project type',
    enum: ProjectType,
    example: ProjectType.DEFAULT,
  })
  @IsOptional()
  @IsEnum(ProjectType)
  type?: ProjectType;

  @ApiPropertyOptional({
    description: 'Updated task list',
    type: [TaskDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks?: TaskDto[];
}

export class TeamDto {
  @ApiPropertyOptional({
    description: 'Updated team languages',
    type: [LanguageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  language?: LanguageDto[];

  @ApiPropertyOptional({
    description: 'Updated required team size per role',
    example: { 'frontend developer': 2, 'backend developer': 1 },
  })
  @IsOptional()
  @IsObject()
  teamSize?: Record<string, number>;
}

export class PublishDto {
  @ApiPropertyOptional({
    description: 'Updated complexity level',
    enum: ComplexityType,
    example: ComplexityType.HIGH,
  })
  @IsOptional()
  @IsEnum(ComplexityType)
  complexity?: ComplexityType;

  @ApiPropertyOptional({
    description: 'Updated project duration in months (0 = no deadline)',
    minimum: 0,
    maximum: 24,
    example: 6,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(24)
  duration?: number;
}

// ─────────────────────────────────────────────────────────────
// Main DTO
// Все три секции опциональные — можно обновить любую комбинацию
// ─────────────────────────────────────────────────────────────

export class UpdateProjectDto {
  @ApiPropertyOptional({
    description: 'Basic project information to update',
    type: () => BasicsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BasicsDto)
  basics?: BasicsDto;

  @ApiPropertyOptional({
    description: 'Team configuration to update',
    type: () => TeamDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TeamDto)
  team?: TeamDto;

  @ApiPropertyOptional({
    description: 'Publishing settings to update',
    type: () => PublishDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PublishDto)
  publish?: PublishDto;
}
