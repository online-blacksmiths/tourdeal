import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as Joi from 'joi';

import { RequestMiddleware } from './core/middlewares/request.middleware';

import { AppService } from './app.service';

import { ContextStorageModule } from '@tourdeal-backend/context-storage/context-storage.module';
import { LoggerModule } from '@tourdeal-backend/logger/logger.module';
import { SwaggerModule } from '@tourdeal-backend/swagger/swagger.module';

import { HttpExceptionFilter } from './core/filters/http-exception.filter';

import { AppController } from './app.controller';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
      ignoreEnvFile: process.env.NODE_ENV == 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'prod', 'debug', 'local')
          .required(),
        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PORT: Joi.number().default(8080),
      }),
    }),
    ContextStorageModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: configService.get<string>('NODE_ENV') !== 'prod',
        logging: configService.get<string>('NODE_ENV') !== 'prod',
      }),
    }),
    // INFO: SwaggerModule는 개발 환경에서만 활성화됩니다.
    ...(process.env.NODE_ENV !== 'prod' ? [SwaggerModule] : []),
  ],
  controllers: [AppController],
  providers: [
    Logger,
    AppService,
    RequestMiddleware,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
