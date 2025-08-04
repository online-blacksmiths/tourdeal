import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseConfig } from './database.config';
import { DATABASE_CONFIG_TOKEN } from './interfaces';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONFIG_TOKEN,
      useClass: DatabaseConfig,
    },
  ],
  exports: [DATABASE_CONFIG_TOKEN],
})
export class DatabaseModule {}
