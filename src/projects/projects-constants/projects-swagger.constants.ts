export enum ProjectsApiOperation {
  CREATE = 'Create a new project',
  DELETE = 'Delete project by ID',
  GET_BY_ID = 'Get project by ID',
  GET_ALL = 'Get all projects',
  START = 'Start a project — changes status to ACTIVE, sets startDate and deadline',
  UPDATE_MEMBERS = 'Update project team members',
  UPDATE = 'Partially update project fields',
}

export enum ProjectsApiResponse {
  // 2xx
  CREATED = 'Project created successfully',
  OK_PROJECT = 'Project data returned successfully',
  OK_PROJECTS = 'List of projects returned successfully',
  OK_DELETED = 'Project deleted successfully',
  OK_STARTED = 'Project started successfully',
  OK_MEMBERS = 'Project members updated successfully',
  OK_UPDATED = 'Project updated successfully',

  // 4xx
  BAD_REQUEST = 'Invalid request data — validation failed',
  NOT_FOUND = 'Project not found',

  // 5xx
  INTERNAL = 'Internal server error',
}

export enum ProjectsApiParam {
  ID = 'Unique numeric project identifier',
  PROJECT_ID = 'Unique numeric identifier of the project to update members for',
}

export enum ProjectsApiExample {
  PROJECT_NAME = 'E-Commerce Platform',
  PROJECT_DESCRIPTION = 'A full-stack e-commerce platform with payment integration',
  PROJECT_GOALS = 'Build a scalable marketplace with 10k concurrent users support',
  TASK_ID = 'task-uuid-001',
  TASK_TITLE = 'Implement authentication module',
  LANGUAGE_CODE = 'en',
  LANGUAGE_LABEL = 'English',
  USER_ID = 'user-uuid-123',
  MEMBER_NAME = 'John Developer',
  AVATAR_URL = 'https://example.com/avatars/john.png',
}
