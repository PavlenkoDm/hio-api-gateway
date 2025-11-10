import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  TeamMemberDto,
} from './projects-dto/create-project.dto';
import { StartProjectDto } from './projects-dto/start-project.dto';
import { UpdateProjectDto } from './projects-dto/update-project.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @HttpCode(201)
  @Post('create')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.deleteProject(id);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getProject(id);
  }

  @Put('start/:id')
  start(
    @Param('id', ParseIntPipe) id: number,
    @Body() startProjectDto: StartProjectDto,
  ) {
    return this.projectsService.startProject(id, startProjectDto);
  }

  @Put('update-members/:projectId')
  updateMembers(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() teamMembers: TeamMemberDto[],
  ) {
    return this.projectsService.updateProjectMembers(projectId, teamMembers);
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: Partial<UpdateProjectDto>,
  ) {
    return this.projectsService.updateProject(id, updateProjectDto);
  }
}
