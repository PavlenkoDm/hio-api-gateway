export enum AuthSwaggerEmailConstants {
  EXAMPLE = 'user@domain.com',
  DESCRIPTION = 'User email',
}

export enum AuthSwaggerPasswordConstants {
  EXAMPLE = 'Password7%',
  DESCRIPTION = 'User password. Must contain uppercase letter, lowercase letter, number and special character',
}

export enum AuthSwaggerApiResponseDescription {
  USER_NOT_FOUND = 'User not found',
  SUCCESSFUL_REGISTRATION = 'User registered successfully',
  SUCCESSFUL_AUTH = 'Successful user authentication',
  SUCCESSFUL_SIGNOUT = 'User sign-out succsessfully',
  VALIDATION_ERROR = 'Validation error: invalid or missing fields in incoming request',
  SERVER_ERROR = 'Internal server error',
  UNAUTHORISED = 'Unauthorised',
}
