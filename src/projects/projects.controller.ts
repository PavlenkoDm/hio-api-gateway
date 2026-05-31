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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  ProjectResponseDto,
  TeamMemberDto,
} from './projects-dto/create-project.dto';
import {
  StartProjectDto,
  StartProjectResponseDto,
} from './projects-dto/start-project.dto';
import { UpdateProjectDto } from './projects-dto/update-project.dto';
import {
  ProjectsApiOperation,
  ProjectsApiParam,
  ProjectsApiResponse,
} from './projects-constants/projects-swagger.constants';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ───────────────────────────────────────────────────────────
  // POST /projects/create
  // ───────────────────────────────────────────────────────────
  @ApiOperation({ summary: ProjectsApiOperation.CREATE })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: ProjectsApiResponse.CREATED,
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ProjectsApiResponse.BAD_REQUEST,
  })
  @ApiResponse({
    status: 500,
    description: ProjectsApiResponse.INTERNAL,
  })
  @HttpCode(201)
  @Post('create')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  // ───────────────────────────────────────────────────────────
  // DELETE /projects/:id
  // ───────────────────────────────────────────────────────────
  @ApiOperation({ summary: ProjectsApiOperation.DELETE })
  @ApiParam({
    name: 'id',
    type: Number,
    description: ProjectsApiParam.ID,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: ProjectsApiResponse.OK_DELETED,
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ProjectsApiResponse.BAD_REQUEST,
  })
  @ApiResponse({
    status: 404,
    description: ProjectsApiResponse.NOT_FOUND,
  })
  @ApiResponse({
    status: 500,
    description: ProjectsApiResponse.INTERNAL,
  })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.deleteProject(id);
  }

  // ───────────────────────────────────────────────────────────
  // GET /projects/:id
  // ───────────────────────────────────────────────────────────
  @ApiOperation({ summary: ProjectsApiOperation.GET_BY_ID })
  @ApiParam({
    name: 'id',
    type: Number,
    description: ProjectsApiParam.ID,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: ProjectsApiResponse.OK_PROJECT,
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ProjectsApiResponse.BAD_REQUEST,
  })
  @ApiResponse({
    status: 404,
    description: ProjectsApiResponse.NOT_FOUND,
  })
  @ApiResponse({
    status: 500,
    description: ProjectsApiResponse.INTERNAL,
  })
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getProject(id);
  }

  // ───────────────────────────────────────────────────────────
  // PUT /projects/start/:id
  // ───────────────────────────────────────────────────────────
  @ApiOperation({ summary: ProjectsApiOperation.START })
  @ApiParam({
    name: 'id',
    type: Number,
    description: ProjectsApiParam.ID,
    example: 1,
  })
  @ApiBody({ type: StartProjectDto })
  @ApiResponse({
    status: 200,
    description: ProjectsApiResponse.OK_STARTED,
    type: StartProjectResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ProjectsApiResponse.BAD_REQUEST,
  })
  @ApiResponse({
    status: 404,
    description: ProjectsApiResponse.NOT_FOUND,
  })
  @ApiResponse({
    status: 500,
    description: ProjectsApiResponse.INTERNAL,
  })
  @Put('start/:id')
  start(
    @Param('id', ParseIntPipe) id: number,
    @Body() startProjectDto: StartProjectDto,
  ) {
    return this.projectsService.startProject(id, startProjectDto);
  }

  // ───────────────────────────────────────────────────────────
  // PUT /projects/update-members/:projectId
  // ───────────────────────────────────────────────────────────
  @ApiOperation({ summary: ProjectsApiOperation.UPDATE_MEMBERS })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: ProjectsApiParam.PROJECT_ID,
    example: 1,
  })
  @ApiBody({ type: [TeamMemberDto] })
  @ApiResponse({
    status: 200,
    description: ProjectsApiResponse.OK_MEMBERS,
    type: [TeamMemberDto],
  })
  @ApiResponse({
    status: 400,
    description: ProjectsApiResponse.BAD_REQUEST,
  })
  @ApiResponse({
    status: 404,
    description: ProjectsApiResponse.NOT_FOUND,
  })
  @ApiResponse({
    status: 500,
    description: ProjectsApiResponse.INTERNAL,
  })
  @Put('update-members/:projectId')
  updateMembers(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() teamMembers: TeamMemberDto[],
  ) {
    return this.projectsService.updateProjectMembers(projectId, teamMembers);
  }

  // ───────────────────────────────────────────────────────────
  // PATCH /projects/update/:id
  // ───────────────────────────────────────────────────────────
  @ApiOperation({ summary: ProjectsApiOperation.UPDATE })
  @ApiParam({
    name: 'id',
    type: Number,
    description: ProjectsApiParam.ID,
    example: 1,
  })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: 200,
    description: ProjectsApiResponse.OK_UPDATED,
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ProjectsApiResponse.BAD_REQUEST,
  })
  @ApiResponse({
    status: 404,
    description: ProjectsApiResponse.NOT_FOUND,
  })
  @ApiResponse({
    status: 500,
    description: ProjectsApiResponse.INTERNAL,
  })
  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(id, updateProjectDto);
  }

  // ───────────────────────────────────────────────────────────
  // GET /projects
  // ───────────────────────────────────────────────────────────
  @ApiOperation({ summary: ProjectsApiOperation.GET_ALL })
  @ApiResponse({
    status: 200,
    description: ProjectsApiResponse.OK_PROJECTS,
    type: [ProjectResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: ProjectsApiResponse.INTERNAL,
  })
  @Get()
  getAll() {
    return this.projectsService.getProjects();
  }
}
