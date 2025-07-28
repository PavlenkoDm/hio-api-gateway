import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';

import { ProjectsService } from './projects.service';
import { ProjectsQueueService } from '../queue/projects-queue.service';
import {
  CreateProjectDto,
  CreateProjectResponseDto,
} from './projects-dto/create-project.dto';
import { ProjectMicroserviceResponse } from './projects-constants/project.constants';

describe('ProjectsService', () => {
  let service: ProjectsService;
  const projectsQueueServiceMock = {
    queueProjectCreate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: ProjectsQueueService, useValue: projectsQueueServiceMock },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw Error if queue-service fails', async () => {
    const dtoMock: CreateProjectDto = {
      name: 'Project_1',
      description: 'Description of the Project_1',
    };

    projectsQueueServiceMock.queueProjectCreate.mockReturnValue(
      throwError(
        () =>
          new HttpException(
            ProjectMicroserviceResponse.INTERNAL_SERVER_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
      ),
    );

    await expect(service.createProject(dtoMock)).rejects.toThrow(HttpException);
    await expect(service.createProject(dtoMock)).rejects.toMatchObject({
      response: ProjectMicroserviceResponse.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  it('should create a project', async () => {
    const createProjectDtoMock: CreateProjectDto = {
      name: 'Project_1',
      description: 'Description of the Project_1',
    };
    const resultMock: CreateProjectResponseDto = {
      status: 201,
      message: 'Project created successfully',
    };

    projectsQueueServiceMock.queueProjectCreate.mockReturnValue(of(resultMock));

    const response = await service.createProject(createProjectDtoMock);

    expect(response).toEqual(resultMock);
    expect(projectsQueueServiceMock.queueProjectCreate).toHaveBeenCalledWith(
      createProjectDtoMock,
    );
  });
});
