import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import request from 'supertest';
import { of, throwError } from 'rxjs';

import { AppModule } from '../src/app.module';
import { QueueClientsNames } from '../src/queue/constants/queue.constants';

import {
  DomainType,
  ProjectType,
  ProjectStatus,
  TeamRole,
  UserStatus,
  WorkDirection,
  ComplexityType,
} from '../src/projects/projects-constants/project.constants';

// ─────────────────────────────────────────────────────────────
// SECTION 1: Мок ClientProxy
// ─────────────────────────────────────────────────────────────
const mockClientProxy = {
  send: jest.fn(),

  connect: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
};

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

function makeValidCreateDto() {
  return {
    basics: {
      name: 'Test Project',
      description: 'Test Description here long enough',
      goals: 'Test Goals here long enough',
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
  };
}

function makeValidStartDto() {
  return {
    basics: {
      name: 'Started Project',
      description: 'Description long enough here',
      goals: 'Goals long enough here too',
      domain: DomainType.WEB_DEVELOPMENT,
      stack: ['React', 'NestJS'],
      type: ProjectType.DEFAULT,
      tasks: [
        { taskId: 't1', title: 'Task One', isCompleted: false },
        { taskId: 't2', title: 'Task Two', isCompleted: false },
        { taskId: 't3', title: 'Task Three', isCompleted: false },
      ],
    },
    team: {
      language: [{ code: 'en', label: 'English' }],
      teamSize: { 'backend developer': 1 },
      members: [
        {
          userId: 'user-1',
          name: 'John Doe Dev',
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

// ─────────────────────────────────────────────────────────────
// SECTION 3: Tests
// ─────────────────────────────────────────────────────────────

describe('Projects API (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })

      .overrideProvider(QueueClientsNames.PROJECTS_QUEUE_CLIENT)
      .useValue(mockClientProxy)
      .overrideProvider(QueueClientsNames.AUTH_QUEUE_CLIENT)
      .useValue(mockClientProxy)
      .compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api', { exclude: ['/'] });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ───────────────────────────────────────────────────────────
  // GET /api/projects
  // ───────────────────────────────────────────────────────────
  describe('GET /api/projects', () => {
    it('should return 200 with array of projects', async () => {
      const projects = [makeProjectResponse()];
      mockClientProxy.send.mockReturnValueOnce(of(projects));

      const response = await request(app.getHttpServer())
        .get('/api/projects')
        .expect(200);

      expect(response.body).toEqual(projects);
    });

    it('should return 200 with empty array when no projects', async () => {
      mockClientProxy.send.mockReturnValueOnce(of([]));

      const response = await request(app.getHttpServer())
        .get('/api/projects')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 500 when microservice fails', async () => {
      const rpcError = { status: 500, message: 'Internal Server Error' };
      mockClientProxy.send.mockReturnValueOnce(throwError(() => rpcError));

      const response = await request(app.getHttpServer())
        .get('/api/projects')
        .expect(500);

      expect(response.body.message).toBe('Internal Server Error');
    });
  });

  // ───────────────────────────────────────────────────────────
  // GET /api/projects/:id
  // ───────────────────────────────────────────────────────────
  describe('GET /api/projects/:id', () => {
    it('should return 200 with project when found', async () => {
      const project = makeProjectResponse();
      mockClientProxy.send.mockReturnValueOnce(of(project));

      const response = await request(app.getHttpServer())
        .get('/api/projects/1')
        .expect(200);

      expect(response.body.basics.id).toBe(1);
    });

    it('should return 404 when project not found', async () => {
      const rpcError = {
        status: 404,
        message: 'Project with id 999 not found',
      };
      mockClientProxy.send.mockReturnValueOnce(throwError(() => rpcError));

      const response = await request(app.getHttpServer())
        .get('/api/projects/999')
        .expect(404);

      expect(response.body.message).toContain('999');
    });

    it('should return 400 when id is not a number', async () => {
      await request(app.getHttpServer())
        .get('/api/projects/not-a-number')
        .expect(400);

      expect(mockClientProxy.send).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────────────────────────────────────────
  // POST /api/projects/create
  // ───────────────────────────────────────────────────────────
  describe('POST /api/projects/create', () => {
    it('should return 201 with created project', async () => {
      const project = makeProjectResponse();
      mockClientProxy.send.mockReturnValueOnce(of(project));

      const response = await request(app.getHttpServer())
        .post('/api/projects/create')
        .send(makeValidCreateDto())
        .expect(201);

      expect(response.body.basics.name).toBe('Test Project');
      expect(response.body.projectStatus).toBe(ProjectStatus.CREATED);
    });

    it('should return 400 when name is too short', async () => {
      const invalidDto = {
        ...makeValidCreateDto(),
        basics: {
          ...makeValidCreateDto().basics,
          name: 'AB',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/api/projects/create')
        .send(invalidDto)
        .expect(400);

      expect(response.body.status).toBe(400);
    });

    it('should return 400 when required fields are missing', async () => {
      await request(app.getHttpServer())
        .post('/api/projects/create')
        .send({})
        .expect(400);

      expect(mockClientProxy.send).not.toHaveBeenCalled();
    });

    it('should return 400 when domain is invalid enum value', async () => {
      const invalidDto = {
        ...makeValidCreateDto(),
        basics: {
          ...makeValidCreateDto().basics,
          domain: 'invalid-domain',
        },
      };

      await request(app.getHttpServer())
        .post('/api/projects/create')
        .send(invalidDto)
        .expect(400);

      expect(mockClientProxy.send).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────────────────────────────────────────
  // DELETE /api/projects/:id
  // ───────────────────────────────────────────────────────────
  describe('DELETE /api/projects/:id', () => {
    it('should return 200 with deleted project data', async () => {
      const project = makeProjectResponse();
      mockClientProxy.send.mockReturnValueOnce(of(project));

      const response = await request(app.getHttpServer())
        .delete('/api/projects/1')
        .expect(200);

      expect(response.body.basics.id).toBe(1);
    });

    it('should return 404 when project not found', async () => {
      const rpcError = {
        status: 404,
        message: 'Project with id 999 not found',
      };
      mockClientProxy.send.mockReturnValueOnce(throwError(() => rpcError));

      await request(app.getHttpServer())
        .delete('/api/projects/999')
        .expect(404);
    });
  });

  // ───────────────────────────────────────────────────────────
  // PUT /api/projects/start/:id
  // ───────────────────────────────────────────────────────────
  describe('PUT /api/projects/start/:id', () => {
    it('should return 200 with active project', async () => {
      // Arrange
      const startedProject = {
        ...makeProjectResponse(),
        projectStatus: ProjectStatus.ACTIVE,
        startDate: '2024-06-01T00:00:00.000Z',
        deadline: '2024-09-01T00:00:00.000Z',
      };
      mockClientProxy.send.mockReturnValueOnce(of(startedProject));

      const response = await request(app.getHttpServer())
        .put('/api/projects/start/1')
        .send(makeValidStartDto())
        .expect(200);

      expect(response.body.projectStatus).toBe(ProjectStatus.ACTIVE);
      expect(response.body.startDate).not.toBeNull();
      expect(response.body.deadline).not.toBeNull();
    });

    it('should return 400 when tasks array has less than 3 items', async () => {
      const invalidDto = {
        ...makeValidStartDto(),
        basics: {
          ...makeValidStartDto().basics,
          tasks: [{ taskId: 't1', title: 'Only one task', isCompleted: false }],
        },
      };

      await request(app.getHttpServer())
        .put('/api/projects/start/1')
        .send(invalidDto)
        .expect(400);

      expect(mockClientProxy.send).not.toHaveBeenCalled();
    });

    it('should return 400 when members array is empty', async () => {
      const invalidDto = {
        ...makeValidStartDto(),
        team: {
          ...makeValidStartDto().team,
          members: [] as Record<string, any>[],
        },
      };

      await request(app.getHttpServer())
        .put('/api/projects/start/1')
        .send(invalidDto)
        .expect(400);

      expect(mockClientProxy.send).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────────────────────────────────────────
  // PATCH /api/projects/update/:id
  // ───────────────────────────────────────────────────────────
  describe('PATCH /api/projects/update/:id', () => {
    it('should return 200 with updated project', async () => {
      const updated = {
        ...makeProjectResponse(),
        basics: { ...makeProjectResponse().basics, name: 'Updated Name' },
      };
      mockClientProxy.send.mockReturnValueOnce(of(updated));

      const response = await request(app.getHttpServer())
        .patch('/api/projects/update/1')
        .send({ basics: { name: 'Updated Name' } })
        .expect(200);

      expect(response.body.basics.name).toBe('Updated Name');
    });

    it('should return 400 when name is too short', async () => {
      await request(app.getHttpServer())
        .patch('/api/projects/update/1')
        .send({ basics: { name: 'AB' } })
        .expect(400);

      expect(mockClientProxy.send).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────────────────────────────────────────
  // PUT /api/projects/update-members/:projectId
  // ───────────────────────────────────────────────────────────
  describe('PUT /api/projects/update-members/:projectId', () => {
    it('should return 200 with updated members', async () => {
      const members = [
        {
          userId: 'user-1',
          name: 'Alice Developer',
          mentorship: false,
          role: TeamRole.USER,
          directions: [WorkDirection.FRONTEND_DEVELOPER],
          status: UserStatus.ACTIVE,
        },
      ];
      mockClientProxy.send.mockReturnValueOnce(of(members));

      const response = await request(app.getHttpServer())
        .put('/api/projects/update-members/1')
        .send(members)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].userId).toBe('user-1');
    });
  });
});
