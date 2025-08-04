import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { IDatabaseConfig } from './interfaces/database-config.interface';

import { DATABASE_CONSTANTS } from './constants/database.constant';

import {
  createDatabaseConfig,
  createValidationConfig,
  DatabaseConfigOptions,
} from './factory/database.factory';
import { DatabaseEnvironment } from './types/database.type';

@Injectable()
export class DatabaseConfig implements IDatabaseConfig {
  constructor(private readonly configService: ConfigService) {}

  getTypeOrmConfig(): TypeOrmModuleOptions {
    const environment = this.configService.get<DatabaseEnvironment>(
      'NODE_ENV',
      'local',
    );

    const configOptions: DatabaseConfigOptions = {
      host: this.configService.get<string>('DB_HOST') ?? 'localhost',
      port: this.configService.get<number>(
        'DB_PORT',
        DATABASE_CONSTANTS.DEFAULT_PORT,
      ),
      username: this.configService.get<string>('DB_USERNAME') ?? '',
      password: this.configService.get<string>('DB_PASSWORD') ?? '',
      database: this.configService.get<string>('DB_NAME') ?? '',
    };

    const baseConfig = createDatabaseConfig(configOptions, environment, {
      enableRetry: true,
    });

    // NestJS 전용 설정 추가
    return {
      ...baseConfig,
      retryAttempts: DATABASE_CONSTANTS.RETRY_ATTEMPTS,
      retryDelay: DATABASE_CONSTANTS.RETRY_DELAY,
    } as TypeOrmModuleOptions;
  }

  async validateConnection(): Promise<boolean> {
    try {
      const { DataSource } = await import('typeorm');

      const configOptions: DatabaseConfigOptions = {
        host: this.configService.get<string>('DB_HOST') ?? 'localhost',
        port: this.configService.get<number>(
          'DB_PORT',
          DATABASE_CONSTANTS.DEFAULT_PORT,
        ),
        username: this.configService.get<string>('DB_USERNAME') ?? '',
        password: this.configService.get<string>('DB_PASSWORD') ?? '',
        database: this.configService.get<string>('DB_NAME') ?? '',
      };

      const testDataSource = new DataSource(
        createValidationConfig(configOptions),
      );

      await testDataSource.initialize();
      await testDataSource.query('SELECT 1 as test_result');
      await testDataSource.destroy();

      return true;
    } catch (error) {
      console.error('Database connection validation failed:', {
        error: error instanceof Error ? error.message : 'Unknown Error',
        timestamp: new Date().toISOString(),
        config: {
          host: this.configService.get<string>('DB_HOST'),
          port: this.configService.get<number>('DB_PORT'),
          username: this.configService.get<string>('DB_USERNAME'),
          database: this.configService.get<string>('DB_NAME'),
        },
      });
      return false;
    }
  }
}
