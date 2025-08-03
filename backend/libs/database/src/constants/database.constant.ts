export const DATABASE_CONSTANTS = {
  DEFAULT_PORT: 3306,
  CONNECTION_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  MAX_CONNECTIONS: 10,
  IDLE_TIMEOUT: 30000,
} as const;

export const DATABASE_ENVIRONMENTS = {
  DEVELOPMENT: 'dev',
  PRODUCTION: 'prod',
  LOCAL: 'local',
  TEST: 'test',
} as const;

export const ENTITY_PATHS = {
  DEVELOPMENT: [__dirname + '/../**/*.entity{.ts,.js}'],
  PRODUCTION: [__dirname + '/../**/*.entity.js'],
};
