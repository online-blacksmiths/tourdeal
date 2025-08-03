export const SWAGGER_CONSTANTS = {
  DEFAULT_PATH: 'api-docs',
  DEFAULT_VERSION: '1.0.0',
  DEFAULT_TITLE: 'API Documentation',
  DEFAULT_DESCRIPTION: 'API documentation generated with Swagger',
} as const;

export const SWAGGER_TAGS = {
  AUTH: 'Authentication',
  USERS: 'Users',
  TOURS: 'Tours',
  BOOKINGS: 'Bookings',
  ADMIN: 'Admin',
} as const;

export const COMMON_RESPONSES = {
  SUCCESS: { status: 200, description: 'Success' },
  CREATED: { status: 201, description: 'Created' },
  BAD_REQUEST: { status: 400, description: 'Bad Request' },
  UNAUTHORIZED: { status: 401, description: 'Unauthorized' },
  FORBIDDEN: { status: 403, description: 'Forbidden' },
  NOT_FOUND: { status: 404, description: 'Not Found' },
  INTERNAL_ERROR: { status: 500, description: 'Internal Server Error' },
} as const;
