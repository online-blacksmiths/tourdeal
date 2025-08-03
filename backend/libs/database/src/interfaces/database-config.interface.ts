import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface IDatabaseConfig {
  getTypeOrmConfig(): TypeOrmModuleOptions;
  validateConnection(): Promise<boolean>;
}

export const DATABASE_CONFIG_TOKEN = Symbol('DATABASE_CONFIG_TOKEN');
