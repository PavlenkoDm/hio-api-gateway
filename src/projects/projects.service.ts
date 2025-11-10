import { Injectable } from '@nestjs/common';

import { ProjectsQueueService } from '../queue/projects-queue.service';
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

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsQueueService: ProjectsQueueService) {}

  createProject(createProjectDto: CreateProjectDto) {
    return new Promise((resolve, reject) => {
      this.projectsQueueService.queueProjectCreate(createProjectDto).subscribe({
        next: async (projectResponseDto: ProjectResponseDto) => {
          return resolve(projectResponseDto);
        },
        error: (error) => reject(error),
      });
    });
  }

  deleteProject(id: number) {
    return new Promise((resolve, reject) => {
      this.projectsQueueService.queueProjectDelete(id).subscribe({
        next: async (projectResponseDto: ProjectResponseDto) => {
          return resolve(projectResponseDto);
        },
        error: (error) => reject(error),
      });
    });
  }

  getProject(id: number) {
    return new Promise((resolve, reject) => {
      this.projectsQueueService.queueProjectGet(id).subscribe({
        next: async (projectResponseDto: ProjectResponseDto) => {
          return resolve(projectResponseDto);
        },
        error: (error) => reject(error),
      });
    });
  }

  startProject(id: number, startProjectDto: StartProjectDto) {
    return new Promise((resolve, reject) => {
      this.projectsQueueService
        .queueProjectStart(id, startProjectDto)
        .subscribe({
          next: async (startProjectResponseDto: StartProjectResponseDto) => {
            return resolve(startProjectResponseDto);
          },
          error: (error) => reject(error),
        });
    });
  }

  updateProjectMembers(projectId: number, teamMembers: TeamMemberDto[]) {
    return new Promise((resolve, reject) => {
      this.projectsQueueService
        .queueUpdateProjectMembers(projectId, teamMembers)
        .subscribe({
          next: async (teamMembers: TeamMemberDto[]) => {
            return resolve(teamMembers);
          },
          error: (error) => reject(error),
        });
    });
  }

  updateProject(id: number, updateProjectDto: Partial<UpdateProjectDto>) {
    return new Promise((resolve, reject) => {
      this.projectsQueueService
        .queueUpdateProject(id, updateProjectDto)
        .subscribe({
          next: async (updatedProject: ProjectResponseDto) => {
            return resolve(updatedProject);
          },
          error: (error) => reject(error),
        });
    });
  }
}
