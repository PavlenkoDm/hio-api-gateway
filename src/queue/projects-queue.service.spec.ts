import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';

import { ProjectsQueueService } from './projects-queue.service';
import {
  QueueClientsNames,
  ProjectsQueueEvents,
} from './constants/queue.constants';
import {
  DomainType,
  ProjectType,
  TeamRole,
  UserStatus,
  WorkDirection,
  ComplexityType,
} from '../projects/projects-constants/project.constants';

// ─────────────────────────────────────────────────────────────
// SECTION 1: Мок ClientProxy
// ─────────────────────────────────────────────────────────────

// ClientProxy — это объект подключения к RabbitMQ.
// Мокируем только метод send() — именно он отправляет
// сообщения в очередь и возвращает Observable с ответом.
const mockClientProxy: Partial<ClientProxy> = {
  send: jest.fn(),
};

// ─────────────────────────────────────────────────────────────
// SECTION 2: Фабричные функции тестовых данных
// ─────────────────────────────────────────────────────────────

function makeCreateProjectDto() {
  return {
    basics: {
      name: 'Test Project',
      description: 'Test Description here',
      goals: 'Test Goals here long',
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

function makeStartProjectDto() {
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

// ─────────────────────────────────────────────────────────────
// SECTION 3: Тесты
// ─────────────────────────────────────────────────────────────

describe('ProjectsQueueService', () => {
  let service: ProjectsQueueService;

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsQueueService,
        // Inject токен — это строка-идентификатор по которой NestJS
        // находит нужный ClientProxy среди всех зарегистрированных клиентов.
        // QueueClientsNames.PROJECTS_QUEUE_CLIENT = 'PROJECTS_QUEUE_CLIENT'
        {
          provide: QueueClientsNames.PROJECTS_QUEUE_CLIENT,
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<ProjectsQueueService>(ProjectsQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ───────────────────────────────────────────────────────────
  // Формирование сообщений для RabbitMQ
  // Проверяем что каждый метод вызывает send() с правильными
  // cmd и payload — именно это получит микросервис
  // ───────────────────────────────────────────────────────────
  describe('RabbitMQ message formation', () => {
    it('queueProjectCreate: should send correct cmd and payload', (done) => {
      // Arrange
      const dto = makeCreateProjectDto();
      (mockClientProxy.send as jest.Mock).mockReturnValueOnce(of({ id: 1 }));

      // Act
      // Подписываемся напрямую на Observable — не оборачиваем в Promise,
      // потому что тестируем сам сервис очереди, а не ProjectsService
      service.queueProjectCreate(dto as any).subscribe({
        next: () => {
          // Assert: send вызван с правильным cmd и dto как payload
          expect(mockClientProxy.send).toHaveBeenCalledWith(
            { cmd: ProjectsQueueEvents.CREATE_PROJECT },
            dto,
          );
          done();
        },
        error: done.fail,
      });
    });

    it('queueProjectDelete: should send id wrapped in object', (done) => {
      // Arrange
      // Важно: id передаётся не напрямую, а обёрнутым в { id }
      // Это формат который ожидает микросервис
      (mockClientProxy.send as jest.Mock).mockReturnValueOnce(of({ id: 1 }));

      // Act
      service.queueProjectDelete(42).subscribe({
        next: () => {
          expect(mockClientProxy.send).toHaveBeenCalledWith(
            { cmd: ProjectsQueueEvents.DELETE_PROJECT_BY_ID },
            { id: 42 },
          );
          done();
        },
        error: done.fail,
      });
    });

    it('queueProjectGet: should send id wrapped in object', (done) => {
      // Arrange
      (mockClientProxy.send as jest.Mock).mockReturnValueOnce(of({ id: 7 }));

      // Act
      service.queueProjectGet(7).subscribe({
        next: () => {
          expect(mockClientProxy.send).toHaveBeenCalledWith(
            { cmd: ProjectsQueueEvents.GET_PROJECT_BY_ID },
            { id: 7 },
          );
          done();
        },
        error: done.fail,
      });
    });

    it('queueProjectStart: should send id and dto together', (done) => {
      // Arrange
      const dto = makeStartProjectDto();
      (mockClientProxy.send as jest.Mock).mockReturnValueOnce(of({}));

      // Act
      service.queueProjectStart(5, dto as any).subscribe({
        next: () => {
          // startProject объединяет id и dto в один объект
          expect(mockClientProxy.send).toHaveBeenCalledWith(
            { cmd: ProjectsQueueEvents.START_PROJECT },
            { id: 5, startProjectDto: dto },
          );
          done();
        },
        error: done.fail,
      });
    });

    it('queueUpdateProjectMembers: should send projectId and members', (done) => {
      // Arrange
      const members = [makeTeamMember()];
      (mockClientProxy.send as jest.Mock).mockReturnValueOnce(of(members));

      // Act
      service.queueUpdateProjectMembers(3, members as any).subscribe({
        next: () => {
          expect(mockClientProxy.send).toHaveBeenCalledWith(
            { cmd: ProjectsQueueEvents.UPDATE_PROJECT_MEMBERS },
            { projectId: 3, teamMembers: members },
          );
          done();
        },
        error: done.fail,
      });
    });

    it('queueUpdateProject: should send id and updateDto', (done) => {
      // Arrange
      const dto = { basics: { name: 'New Name' } };
      (mockClientProxy.send as jest.Mock).mockReturnValueOnce(of({}));

      // Act
      service.queueUpdateProject(8, dto as any).subscribe({
        next: () => {
          expect(mockClientProxy.send).toHaveBeenCalledWith(
            { cmd: ProjectsQueueEvents.UPDATE_PROJECT },
            { id: 8, updateProjectDto: dto },
          );
          done();
        },
        error: done.fail,
      });
    });

    it('queueProjectsGet: should send empty object as payload', (done) => {
      // Arrange
      // getProjects не требует параметров — отправляем пустой объект
      (mockClientProxy.send as jest.Mock).mockReturnValueOnce(of([]));

      // Act
      service.queueProjectsGet().subscribe({
        next: () => {
          expect(mockClientProxy.send).toHaveBeenCalledWith(
            { cmd: ProjectsQueueEvents.GET_PROJECTS },
            {},
          );
          done();
        },
        error: done.fail,
      });
    });
  });

  // ───────────────────────────────────────────────────────────
  // Обработка ошибок
  // Проверяем что catchError правильно преобразует разные
  // форматы ошибок в HttpException
  // ───────────────────────────────────────────────────────────
  describe('error handling in projectsQueueSender', () => {
    it('should convert object error with status to HttpException', (done) => {
      // Arrange
      // Формат ошибки от микросервиса через RpcException:
      // объект с полями status и message
      const rpcError = { status: 404, message: 'Project not found' };
      (mockClientProxy.send as jest.Mock).mockReturnValueOnce(
        throwError(() => rpcError),
      );

      // Act
      service.queueProjectGet(999).subscribe({
        next: () => done.fail('Should have errored'),
        error: (err) => {
          // Assert: преобразован в HttpException с правильным статусом
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.NOT_FOUND);
          expect(err.message).toBe('Project not found');
          done();
        },
      });
    });

    it('should convert 500 status error to HttpException', (done) => {
      // Arrange
      const rpcError = { status: 500, message: 'Internal Server Error' };
      (mockClientProxy.send as jest.Mock).mockReturnValueOnce(
        throwError(() => rpcError),
      );

      // Act
      service.queueProjectGet(1).subscribe({
        next: () => done.fail('Should have errored'),
        error: (err) => {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
          done();
        },
      });
    });

    it('should convert generic Error object to Error instance', (done) => {
      // Arrange
      // Неизвестная ошибка не от микросервиса — нет поля status
      const genericError = new Error('Connection refused');
      (mockClientProxy.send as jest.Mock).mockReturnValueOnce(
        throwError(() => genericError),
      );

      // Act
      service.queueProjectGet(1).subscribe({
        next: () => done.fail('Should have errored'),
        error: (err) => {
          // Пробрасывается как есть через throwError(() => new Error(error))
          expect(err).toBeInstanceOf(Error);
          done();
        },
      });
    });

    it('should pass through HttpException from upstream without wrapping', (done) => {
      // Arrange
      // Если где-то выше уже создан HttpException —
      // catchError его тоже перехватит и обернёт в новый Error.
      // Это важно знать: catchError не различает HttpException и обычные ошибки
      // если у объекта нет поля .status в нужном формате.
      const httpError = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      (mockClientProxy.send as jest.Mock).mockReturnValueOnce(
        throwError(() => httpError),
      );

      // Act
      service.queueProjectGet(1).subscribe({
        next: () => done.fail('Should have errored'),
        error: (err) => {
          // HttpException имеет .status — поэтому catchError его подхватит
          // и создаст новый HttpException с тем же статусом
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.FORBIDDEN);
          done();
        },
      });
    });
  });
});
