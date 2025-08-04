import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import {
  DATABASE_CONSTANTS,
  DATABASE_ENVIRONMENTS,
  DATABASE_PATHS,
  getLoggingConfig,
  MIGRATION_CONSTANTS,
} from '../constants/database.constant';

import * as entities from '../entities';

/**
 * 데이터베이스 연결 설정 옵션 인터페이스
 */
export interface DatabaseConfigOptions {
  /** 데이터베이스 호스트 */
  host: string;
  /** 데이터베이스 포트 */
  port: number;
  /** 사용자명 */
  username: string;
  /** 비밀번호 */
  password: string;
  /** 데이터베이스명 */
  database: string;
}

/**
 * Factory 함수 추가 옵션
 */
export interface DatabaseFactoryOptions {
  /** CLI 환경 여부 (Migration 실행 등) */
  isForCli?: boolean;
  /** 재시도 설정 활성화 여부 (NestJS 전용) */
  enableRetry?: boolean;
  /** 추가 설정 오버라이드 */
  overrides?: Partial<DataSourceOptions>;
}

/**
 * 공통 데이터베이스 설정을 생성하는 Factory 함수
 *
 * @param configOptions 데이터베이스 연결 설정
 * @param environment 실행 환경 (local, dev, prod, test)
 * @param factoryOptions Factory 추가 옵션
 * @returns TypeORM DataSourceOptions 설정 객체
 *
 * @example
 * ```typescript
 * // NestJS 환경에서 사용
 * const config = createDatabaseConfig({
 *   host: configService.get('DB_HOST'),
 *   port: configService.get('DB_PORT'),
 *   username: configService.get('DB_USERNAME'),
 *   password: configService.get('DB_PASSWORD'),
 *   database: configService.get('DB_NAME'),
 * }, 'local', { enableRetry: true });
 *
 * // CLI 환경에서 사용
 * const config = createDatabaseConfig({
 *   host: process.env.DB_HOST,
 *   port: parseInt(process.env.DB_PORT ?? '3306'),
 *   username: process.env.DB_USERNAME,
 *   password: process.env.DB_PASSWORD,
 *   database: process.env.DB_NAME,
 * }, process.env.NODE_ENV ?? 'local', { isForCli: true });
 * ```
 */
export function createDatabaseConfig(
  configOptions: DatabaseConfigOptions,
  environment: string,
  factoryOptions: DatabaseFactoryOptions = {},
): DataSourceOptions {
  const {
    isForCli = false,
    enableRetry = false,
    overrides = {},
  } = factoryOptions;

  // 기본 설정
  const baseConfig: DataSourceOptions = {
    type: 'mysql',
    host: configOptions.host,
    port: configOptions.port,
    username: configOptions.username,
    password: configOptions.password,
    database: configOptions.database,

    // 경로 설정 - 환경별 동적 생성
    entities: Object.values(entities),
    migrations: DATABASE_PATHS.MIGRATIONS,
    migrationsTableName: MIGRATION_CONSTANTS.TABLE_NAME,

    // 공통 설정
    namingStrategy: new SnakeNamingStrategy(),
    connectTimeout: DATABASE_CONSTANTS.CONNECTION_TIMEOUT,

    // 환경별 설정
    synchronize: environment === DATABASE_ENVIRONMENTS.LOCAL && !isForCli,
    logging: isForCli
      ? environment !== DATABASE_ENVIRONMENTS.PRODUCTION
      : getLoggingConfig(environment),

    // 연결 풀 및 기타 설정
    extra: {
      connectionLimit: DATABASE_CONSTANTS.MAX_CONNECTIONS,
      charset: 'utf8mb4_general_ci',
      timezone: '+00:00',
    },
  };

  if (enableRetry) {
    const retryConfig = {
      ...baseConfig,
      ...overrides,
      _nestjsRetryConfig: {
        retryAttempts: DATABASE_CONSTANTS.RETRY_ATTEMPTS,
        retryDelay: DATABASE_CONSTANTS.RETRY_DELAY,
      },
    };
    return retryConfig as DataSourceOptions;
  }

  // 추가 설정 오버라이드 적용
  return {
    ...baseConfig,
    ...overrides,
  } as DataSourceOptions;
}

/**
 * 검증용 간소화된 데이터베이스 설정 생성
 *
 * @param configOptions 데이터베이스 연결 설정
 * @returns 검증용 DataSourceOptions (entities, migrations 제외)
 */
export function createValidationConfig(
  configOptions: DatabaseConfigOptions,
): DataSourceOptions {
  return {
    type: 'mysql',
    host: configOptions.host,
    port: configOptions.port,
    username: configOptions.username,
    password: configOptions.password,
    database: configOptions.database,
    logging: false,
    // 검증용이므로 entities와 migrations는 빈 배열
    entities: [],
    migrations: [],
  };
}
