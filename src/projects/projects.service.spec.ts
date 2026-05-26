import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';

import { ProjectsService } from './projects.service';
import { ProjectsQueueService } from '../queue/projects-queue.service';
import {
  DomainType,
  ProjectStatus,
  ProjectType,
  TeamRole,
  UserStatus,
  WorkDirection,
  ComplexityType,
} from './projects-constants/project.constants';
import { CreateProjectDto } from './projects-dto/create-project.dto';
import { StartProjectDto } from './projects-dto/start-project.dto';
import { UpdateProjectDto } from './projects-dto/update-project.dto';

function makeProjectResponse() {
  return {
    basics: {
      id: 1,
      name: 'Test Project',
      description: 'Test Description',
      goals: 'Test Goals',
      domain: DomainType.WEB_DEVELOPMENT,
      stack: ['React'],
      type: ProjectType.DEFAULT,
      tasks: [] as string[],
    },
    team: {
      language: [{ code: 'en', label: 'English' }],
      teamSize: { 'frontend developer': 1 },
      members: [] as Record<string, any>[],
    },
    publish: {
      complexity: ComplexityType.MEDIUM,
      duration: 3,
    },
    projectStatus: ProjectStatus.CREATED,
    createdAt: '2024-01-01T00:00:00.000Z',
    startDate: null as any,
    deadline: null as any,
    frozenDate: null as any,
  };
}

function makeCreateProjectDto(): CreateProjectDto {
  return {
    basics: {
      name: 'Test Project',
      description: 'Test Description here',
      goals: 'Test Goals here long',
      domain: DomainType.WEB_DEVELOPMENT,
      stack: ['React'],
      type: ProjectType.DEFAULT,
      tasks: [],
    },
    team: {
      language: [{ code: 'en', label: 'English' }],
      teamSize: { 'frontend developer': 1 },
      members: [],
    },
    publish: {
      complexity: ComplexityType.MEDIUM,
      duration: 3,
    },
  };
}

function makeStartProjectDto(): StartProjectDto {
  return {
    basics: {
      name: 'Started Project',
      description: 'Description long enough',
      goals: 'Goals long enough here',
      domain: DomainType.WEB_DEVELOPMENT,
      stack: ['React'],
      type: ProjectType.DEFAULT,
      tasks: [
        { taskId: 't1', title: 'Task 1', isCompleted: false },
        { taskId: 't2', title: 'Task 2', isCompleted: false },
        { taskId: 't3', title: 'Task 3', isCompleted: false },
      ],
    },
    team: {
      language: [{ code: 'en', label: 'English' }],
      teamSize: { 'backend developer': 1 },
      members: [
        {
          userId: 'user-1',
          name: 'John Doe',
          mentorship: false,
          role: TeamRole.OWNER,
          directions: [WorkDirection.BACKEND_DEVELOPER],
          status: UserStatus.ACTIVE,
        },
      ],
    },
    publish: {
      complexity: ComplexityType.MEDIUM,
      duration: 3,
    },
  };
}

function makeUpdateProjectDto(): Partial<UpdateProjectDto> {
  return {
    basics: { name: 'Updated Name' },
  };
}

function makeTeamMember() {
  return {
    userId: 'user-1',
    name: 'Alice Dev',
    mentorship: false,
    role: TeamRole.USER,
    directions: [WorkDirection.FRONTEND_DEVELOPER],
    status: UserStatus.ACTIVE,
  };
}

const mockProjectsQueueService = {
  queueProjectCreate: jest.fn(),
  queueProjectDelete: jest.fn(),
  queueProjectGet: jest.fn(),
  queueProjectStart: jest.fn(),
  queueUpdateProjectMembers: jest.fn(),
  queueUpdateProject: jest.fn(),
  queueProjectsGet: jest.fn(),
};

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,

        {
          provide: ProjectsQueueService,
          useValue: mockProjectsQueueService,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // createProject()
  // ───────────────────────────────────────────────────────────
  describe('createProject', () => {
    it('should resolve with project response when queue succeeds', async () => {
      const expected = makeProjectResponse();
      mockProjectsQueueService.queueProjectCreate.mockReturnValueOnce(
        of(expected),
      );
      const dto = makeCreateProjectDto();

      const result = await service.createProject(dto);

      expect(result).toEqual(expected);
      expect(mockProjectsQueueService.queueProjectCreate).toHaveBeenCalledWith(
        dto,
      );
      expect(mockProjectsQueueService.queueProjectCreate).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should reject with HttpException when queue returns error', async () => {
      const error = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      mockProjectsQueueService.queueProjectCreate.mockReturnValueOnce(
        throwError(() => error),
      );

      await expect(
        service.createProject(makeCreateProjectDto()),
      ).rejects.toThrow(HttpException);
    });
  });

  // deleteProject()
  // ───────────────────────────────────────────────────────────
  describe('deleteProject', () => {
    it('should resolve with deleted project response', async () => {
      const expected = makeProjectResponse();
      mockProjectsQueueService.queueProjectDelete.mockReturnValueOnce(
        of(expected),
      );

      const result = await service.deleteProject(1);

      expect(result).toEqual(expected);

      expect(mockProjectsQueueService.queueProjectDelete).toHaveBeenCalledWith(
        1,
      );
    });

    it('should reject with HttpException when project not found', async () => {
      const error = new HttpException('Not Found', HttpStatus.NOT_FOUND);
      mockProjectsQueueService.queueProjectDelete.mockReturnValueOnce(
        throwError(() => error),
      );

      await expect(service.deleteProject(999)).rejects.toThrow(HttpException);
    });
  });

  // getProject()
  // ───────────────────────────────────────────────────────────
  describe('getProject', () => {
    it('should resolve with project when found', async () => {
      const expected = makeProjectResponse();
      mockProjectsQueueService.queueProjectGet.mockReturnValueOnce(
        of(expected),
      );

      const result = await service.getProject(1);

      expect(result).toEqual(expected);
      expect(mockProjectsQueueService.queueProjectGet).toHaveBeenCalledWith(1);
    });

    it('should reject with HttpException when project not found', async () => {
      const error = new HttpException('Not Found', HttpStatus.NOT_FOUND);
      mockProjectsQueueService.queueProjectGet.mockReturnValueOnce(
        throwError(() => error),
      );

      await expect(service.getProject(999)).rejects.toThrow(HttpException);
    });
  });

  // startProject()
  // ───────────────────────────────────────────────────────────
  describe('startProject', () => {
    it('should resolve with started project response', async () => {
      const expected = {
        ...makeProjectResponse(),
        projectStatus: ProjectStatus.ACTIVE,
        startDate: '2024-06-01T00:00:00.000Z',
        deadline: '2024-09-01T00:00:00.000Z',
      };
      mockProjectsQueueService.queueProjectStart.mockReturnValueOnce(
        of(expected),
      );
      const dto = makeStartProjectDto();

      const result = await service.startProject(1, dto);

      expect(result).toEqual(expected);

      expect(mockProjectsQueueService.queueProjectStart).toHaveBeenCalledWith(
        1,
        dto,
      );
    });

    it('should reject when project not found', async () => {
      const error = new HttpException('Not Found', HttpStatus.NOT_FOUND);
      mockProjectsQueueService.queueProjectStart.mockReturnValueOnce(
        throwError(() => error),
      );

      await expect(
        service.startProject(999, makeStartProjectDto()),
      ).rejects.toThrow(HttpException);
    });
  });

  // updateProjectMembers()
  // ───────────────────────────────────────────────────────────
  describe('updateProjectMembers', () => {
    it('should resolve with updated members array', async () => {
      const members = [makeTeamMember()];
      mockProjectsQueueService.queueUpdateProjectMembers.mockReturnValueOnce(
        of(members),
      );

      const result = await service.updateProjectMembers(1, members as any);

      expect(result).toEqual(members);
      expect(
        mockProjectsQueueService.queueUpdateProjectMembers,
      ).toHaveBeenCalledWith(1, members);
    });

    it('should reject when project not found', async () => {
      const error = new HttpException('Not Found', HttpStatus.NOT_FOUND);
      mockProjectsQueueService.queueUpdateProjectMembers.mockReturnValueOnce(
        throwError(() => error),
      );

      await expect(
        service.updateProjectMembers(999, [makeTeamMember() as any]),
      ).rejects.toThrow(HttpException);
    });
  });

  // updateProject()
  // ───────────────────────────────────────────────────────────
  describe('updateProject', () => {
    it('should resolve with updated project response', async () => {
      const expected = {
        ...makeProjectResponse(),
        basics: { ...makeProjectResponse().basics, name: 'Updated Name' },
      };
      mockProjectsQueueService.queueUpdateProject.mockReturnValueOnce(
        of(expected),
      );
      const dto = makeUpdateProjectDto();

      const result = await service.updateProject(1, dto);

      expect(result).toEqual(expected);
      expect(mockProjectsQueueService.queueUpdateProject).toHaveBeenCalledWith(
        1,
        dto,
      );
    });

    it('should reject when update fails', async () => {
      const error = new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      mockProjectsQueueService.queueUpdateProject.mockReturnValueOnce(
        throwError(() => error),
      );

      await expect(
        service.updateProject(1, makeUpdateProjectDto()),
      ).rejects.toThrow(HttpException);
    });
  });

  // getProjects()
  // ───────────────────────────────────────────────────────────
  describe('getProjects', () => {
    it('should resolve with array of projects', async () => {
      const expected = [makeProjectResponse(), makeProjectResponse()];
      mockProjectsQueueService.queueProjectsGet.mockReturnValueOnce(
        of(expected),
      );

      const result = await service.getProjects();

      expect(result).toEqual(expected);

      expect(mockProjectsQueueService.queueProjectsGet).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should resolve with empty array when no projects exist', async () => {
      mockProjectsQueueService.queueProjectsGet.mockReturnValueOnce(of([]));

      const result = await service.getProjects();

      expect(result).toEqual([]);
    });

    it('should reject when queue fails', async () => {
      const error = new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      mockProjectsQueueService.queueProjectsGet.mockReturnValueOnce(
        throwError(() => error),
      );

      await expect(service.getProjects()).rejects.toThrow(HttpException);
    });
  });
});
