import * as path from 'path';

import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { DATABASE_CONSTANTS } from './constants/database.constant';

import {
  createDatabaseConfig,
  DatabaseConfigOptions,
} from './factory/database.factory';

// 환경 변수 로드 (CLI 사용 시 필요)
const envPath = process.env.NODE_ENV
  ? path.resolve(process.cwd(), `apps/api/.${process.env.NODE_ENV}.env`)
  : path.resolve(process.cwd(), 'apps/api/.local.env');

config({ path: envPath });

/**
 * CLI 환경에서 사용할 데이터베이스 설정 옵션 생성
 */
function createCliDatabaseOptions(): DatabaseConfigOptions {
  // 필수 환경변수 검증
  const requiredEnvVars = ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME'];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables for database connection: ${missingVars.join(', ')}`,
    );
  }

  return {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(
      process.env.DB_PORT ?? String(DATABASE_CONSTANTS.DEFAULT_PORT),
      10,
    ),
    username: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? '',
  };
}

/**
 * TypeORM CLI용 DataSource 설정
 * Migration 생성/실행을 위해 사용됩니다.
 *
 * @example
 * # Migration 생성
 * npx typeorm-ts-node-commonjs migration:generate -d libs/database/src/data-source.ts libs/database/src/migrations/AddUserTable
 *
 * # Migration 실행
 * npx typeorm-ts-node-commonjs migration:run -d libs/database/src/data-source.ts
 */
const AppDataSource = new DataSource(
  createDatabaseConfig(
    createCliDatabaseOptions(),
    process.env.NODE_ENV ?? 'local',
    {
      isForCli: true, // CLI 환경 전용 설정 적용
      enableRetry: false, // CLI에서는 재시도 비활성화
    },
  ),
);

export default AppDataSource;
