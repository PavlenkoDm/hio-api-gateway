import { Controller, Inject, Post } from '@nestjs/common';

import { ProjectsService } from './projects.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(@Inject() private readonly projectsService: ProjectsService) {}

  @Post('create')
  create() {
    return this.projectsService.createProject();
  }
}
