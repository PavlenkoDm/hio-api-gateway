import { Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(@Inject() private readonly projectsService: ProjectsService) {}

  @Post('create')
  create() {
    return this.projectsService.createProject();
  }
}
