import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  CreateProjectResponseDto,
} from './projects-dto/create-project.dto';
import { ProjectMicroserviceResponse } from './projects-constants/project.constants';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  const projectsServiceMock = {
    createProject: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [{ provide: ProjectsService, useValue: projectsServiceMock }],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw Error if service fails', async () => {
    const dtoMock: CreateProjectDto = {
      name: 'Project_1',
      description: 'Description of the Project_1',
    };

    projectsServiceMock.createProject.mockRejectedValue(
      new HttpException(
        ProjectMicroserviceResponse.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );

    await expect(controller.create(dtoMock)).rejects.toThrow(HttpException);
    await expect(controller.create(dtoMock)).rejects.toThrow(
      ProjectMicroserviceResponse.INTERNAL_SERVER_ERROR,
    );
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

    projectsServiceMock.createProject.mockResolvedValue(resultMock);

    const response = await controller.create(createProjectDtoMock);

    expect(response).toEqual(resultMock);
    expect(projectsServiceMock.createProject).toHaveBeenCalledWith(
      createProjectDtoMock,
    );
  });
});
