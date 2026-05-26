import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { ProjectsController } from './projects.controller';
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
    publish: { complexity: ComplexityType.MEDIUM, duration: 3 },
    projectStatus: ProjectStatus.CREATED,
    createdAt: '2024-01-01T00:00:00.000Z',
    startDate: null as any,
    deadline: null as any,
    frozenDate: null as any,
  };
}

function makeCreateDto(): CreateProjectDto {
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
    publish: { complexity: ComplexityType.MEDIUM, duration: 3 },
  };
}

function makeStartDto(): StartProjectDto {
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
    publish: { complexity: ComplexityType.MEDIUM, duration: 3 },
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

const mockProjectsService = {
  createProject: jest.fn(),
  deleteProject: jest.fn(),
  getProject: jest.fn(),
  startProject: jest.fn(),
  updateProjectMembers: jest.fn(),
  updateProject: jest.fn(),
  getProjects: jest.fn(),
};

const mockProjectsQueueService = {
  queueProjectCreate: jest.fn(),
  queueProjectDelete: jest.fn(),
  queueProjectGet: jest.fn(),
  queueProjectStart: jest.fn(),
  queueUpdateProjectMembers: jest.fn(),
  queueUpdateProject: jest.fn(),
  queueProjectsGet: jest.fn(),
};

// SECTION 3: Тесты
// ─────────────────────────────────────────────────────────────

describe('ProjectsController', () => {
  let controller: ProjectsController;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
        {
          provide: ProjectsQueueService,
          useValue: mockProjectsQueueService,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // POST /projects/create
  // ───────────────────────────────────────────────────────────
  describe('create()', () => {
    it('should call createProject with dto and return result', async () => {
      const dto = makeCreateDto();
      const expected = makeProjectResponse();

      mockProjectsService.createProject.mockResolvedValueOnce(expected);

      const result = await controller.create(dto);

      expect(result).toEqual(expected);
      expect(mockProjectsService.createProject).toHaveBeenCalledWith(dto);
      expect(mockProjectsService.createProject).toHaveBeenCalledTimes(1);
    });

    it('should propagate HttpException when service rejects', async () => {
      mockProjectsService.createProject.mockRejectedValueOnce(
        new HttpException('Bad Request', HttpStatus.BAD_REQUEST),
      );

      await expect(controller.create(makeCreateDto())).rejects.toThrow(
        HttpException,
      );
    });
  });

  // DELETE /projects/:id
  // ───────────────────────────────────────────────────────────
  describe('delete()', () => {
    it('should call deleteProject with parsed id', async () => {
      const expected = makeProjectResponse();
      mockProjectsService.deleteProject.mockResolvedValueOnce(expected);

      const result = await controller.delete(1);

      expect(result).toEqual(expected);
      expect(mockProjectsService.deleteProject).toHaveBeenCalledWith(1);
    });

    it('should propagate HttpException when project not found', async () => {
      mockProjectsService.deleteProject.mockRejectedValueOnce(
        new HttpException('Not Found', HttpStatus.NOT_FOUND),
      );

      await expect(controller.delete(999)).rejects.toThrow(HttpException);
    });
  });

  // GET /projects/:id
  // ───────────────────────────────────────────────────────────
  describe('getById()', () => {
    it('should call getProject with id and return result', async () => {
      const expected = makeProjectResponse();
      mockProjectsService.getProject.mockResolvedValueOnce(expected);

      const result = await controller.getById(1);

      expect(result).toEqual(expected);
      expect(mockProjectsService.getProject).toHaveBeenCalledWith(1);
    });

    it('should propagate HttpException when not found', async () => {
      mockProjectsService.getProject.mockRejectedValueOnce(
        new HttpException('Not Found', HttpStatus.NOT_FOUND),
      );

      await expect(controller.getById(999)).rejects.toThrow(HttpException);
    });
  });

  // PUT /projects/start/:id
  // ───────────────────────────────────────────────────────────
  describe('start()', () => {
    it('should call startProject with id and dto', async () => {
      const dto = makeStartDto();
      const expected = {
        ...makeProjectResponse(),
        projectStatus: ProjectStatus.ACTIVE,
        startDate: '2024-06-01T00:00:00.000Z',
        deadline: '2024-09-01T00:00:00.000Z',
      };
      mockProjectsService.startProject.mockResolvedValueOnce(expected);

      const result = await controller.start(1, dto);

      expect(result).toEqual(expected);

      expect(mockProjectsService.startProject).toHaveBeenCalledWith(1, dto);
    });

    it('should propagate HttpException when project not found', async () => {
      mockProjectsService.startProject.mockRejectedValueOnce(
        new HttpException('Not Found', HttpStatus.NOT_FOUND),
      );

      await expect(controller.start(999, makeStartDto())).rejects.toThrow(
        HttpException,
      );
    });
  });

  // PUT /projects/update-members/:projectId
  // ───────────────────────────────────────────────────────────
  describe('updateMembers()', () => {
    it('should call updateProjectMembers with projectId and members', async () => {
      const members = [makeTeamMember()];
      mockProjectsService.updateProjectMembers.mockResolvedValueOnce(members);

      const result = await controller.updateMembers(1, members as any);

      expect(result).toEqual(members);
      expect(mockProjectsService.updateProjectMembers).toHaveBeenCalledWith(
        1,
        members,
      );
    });

    it('should propagate HttpException on error', async () => {
      mockProjectsService.updateProjectMembers.mockRejectedValueOnce(
        new HttpException('Not Found', HttpStatus.NOT_FOUND),
      );

      await expect(
        controller.updateMembers(999, [makeTeamMember() as any]),
      ).rejects.toThrow(HttpException);
    });
  });

  // PATCH /projects/update/:id
  // ───────────────────────────────────────────────────────────
  describe('update()', () => {
    it('should call updateProject with id and partial dto', async () => {
      const dto: Partial<UpdateProjectDto> = { basics: { name: 'New Name' } };
      const expected = {
        ...makeProjectResponse(),
        basics: { ...makeProjectResponse().basics, name: 'New Name' },
      };
      mockProjectsService.updateProject.mockResolvedValueOnce(expected);

      const result = await controller.update(1, dto);

      expect(result).toEqual(expected);
      expect(mockProjectsService.updateProject).toHaveBeenCalledWith(1, dto);
    });

    it('should propagate HttpException on error', async () => {
      mockProjectsService.updateProject.mockRejectedValueOnce(
        new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      await expect(
        controller.update(1, { basics: { name: 'X' } }),
      ).rejects.toThrow(HttpException);
    });
  });

  // GET /projects
  // ───────────────────────────────────────────────────────────
  describe('getAll()', () => {
    it('should call getProjects and return array', async () => {
      const expected = [makeProjectResponse()];
      mockProjectsService.getProjects.mockResolvedValueOnce(expected);

      const result = await controller.getAll();

      expect(result).toEqual(expected);
      expect(mockProjectsService.getProjects).toHaveBeenCalledTimes(1);

      expect(mockProjectsService.getProjects).toHaveBeenCalledWith();
    });

    it('should return empty array when no projects exist', async () => {
      mockProjectsService.getProjects.mockResolvedValueOnce([]);

      const result = await controller.getAll();

      expect(result).toEqual([]);
    });

    it('should propagate HttpException on error', async () => {
      mockProjectsService.getProjects.mockRejectedValueOnce(
        new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      await expect(controller.getAll()).rejects.toThrow(HttpException);
    });
  });
});
