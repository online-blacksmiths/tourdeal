import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { IDatabaseConfig } from './interfaces/database-config.interface';

import {
  DATABASE_CONSTANTS,
  DATABASE_ENVIRONMENTS,
  ENTITY_PATHS,
} from './constants/database.constant';

import { DatabaseEnvironment } from './types/database.type';

@Injectable()
export class DatabaseConfig implements IDatabaseConfig {
  constructor(private readonly configService: ConfigService) {}

  getTypeOrmConfig(): TypeOrmModuleOptions {
    const environment = this.configService.get<DatabaseEnvironment>(
      'NODE_ENV',
      'local',
    );
    const isProduction = environment === DATABASE_ENVIRONMENTS.PRODUCTION;

    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>(
        'DB_PORT',
        DATABASE_CONSTANTS.DEFAULT_PORT,
      ),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      entities: isProduction
        ? ENTITY_PATHS.PRODUCTION
        : ENTITY_PATHS.DEVELOPMENT,
      synchronize: !isProduction,
      logging: !isProduction,
      connectTimeout: DATABASE_CONSTANTS.CONNECTION_TIMEOUT,
      retryAttempts: DATABASE_CONSTANTS.RETRY_ATTEMPTS,
      retryDelay: DATABASE_CONSTANTS.RETRY_DELAY,
      extra: {
        connectionLimit: DATABASE_CONSTANTS.MAX_CONNECTIONS,
        idleTimeout: DATABASE_CONSTANTS.IDLE_TIMEOUT,
      },
    };
  }

  validateConnection(): Promise<boolean> {
    try {
      // TODO: Implement actual connection validation
      // This would typically involve creating a test connection
      return Promise.resolve(true);
    } catch (error) {
      console.error('Database connection validation failed:', error);
      return Promise.resolve(false);
    }
  }
}
