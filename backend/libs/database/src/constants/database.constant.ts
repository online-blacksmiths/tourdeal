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

export const DATABASE_PATHS = {
  MIGRATIONS: [__dirname + '/../migrations/**/*.{ts,js}'],
};

/**
 * 환경별 로깅 설정을 반환하는 함수
 */
export const getLoggingConfig = (
  environment: string,
):
  | boolean
  | 'all'
  | (
      | 'query'
      | 'error'
      | 'schema'
      | 'warn'
      | 'info'
      | 'log'
      | 'migration'
    )[] => {
  const isProduction = environment === DATABASE_ENVIRONMENTS.PRODUCTION;
  if (isProduction) {
    return ['error', 'warn'];
  }
  return true;
};

/**
 * TypeORM Migration 설정 상수
 */
export const MIGRATION_CONSTANTS = {
  /** Migration 테이블명 */
  TABLE_NAME: 'typeorm_migrations',
} as const;
