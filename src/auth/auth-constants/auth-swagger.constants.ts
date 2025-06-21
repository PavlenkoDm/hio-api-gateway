export enum AuthSwaggerEmailConstants {
  EXAMPLE = 'user@domain.com',
  DESCRIPTION = 'User email',
  MONGO_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyKpZCI6IjY3YmNiYmY5MjBiMzJjZGE2MjIwY2U2ZCIsImlhdCI6MTc0MDg1ODExNCwiZXhwIjoxODI3MjU4MTE0fQ.DHyPfqrA4ERRSiTtTAtIHbU3NDjoUEwlH2di8tryMd4',
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
  EMAIL_IN_USE = 'Conflict: email already in use',
  STATUS_CODE = 'Status code',
  USER_LOGGED_IN = 'User has successfully logged into account',
  USER_TOKENS_UPDATED = 'User tokens updated successfully',
  USER_CREATED = 'User created successfully',
  USER_IN_DB = 'User in database',
  UPDATED_TOKENS = 'Updated tokens',
  MONGO_ID = 'MongoDB id',
  USER_ACCESS_TOKEN = 'User access token',
  USER_REFRESH_TOKEN = 'User refresh token',
  TOKENS_UPDATED = 'Access token and refresh token updated successfully',
}

export enum AuthSwaggerTokenConstants {
  DESCRIPTION = 'Mongo DB token',
  MONGO_TOKEN_EXAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyKpZCI6IjY3YmNiYmY5MjBiMzJjZGE2MjIwY2U2ZCIsImlhdCI6MTc0MDg1ODExNCwiZXhwIjoxODI3MjU4MTE0fQ.DHyPfqrA4ERRSiTtTAtIHbU3NDjoUEwlH2di8tryMd4',
}
