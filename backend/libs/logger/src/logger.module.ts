import {
  Global,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as winston from 'winston';

import LoggerService from './logger.service';

import Logger, {
  LoggerBaseKey,
  LoggerKey,
} from './interfaces/logger.interface';

import { MorganConfig } from './infra/morgan/configs/morgan.config';
import NestjsLoggerServiceAdapter from './infra/nestjs/logger-service.adapter';
import ConsoleTransport from './infra/winston/transports/console.transport';
import WinstonLogger, {
  WinstonLoggerTransportsKey,
} from './infra/winston/winstonLogger';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: LoggerBaseKey,
      useClass: WinstonLogger,
    },
    {
      provide: LoggerKey,
      useClass: LoggerService,
    },
    {
      provide: NestjsLoggerServiceAdapter,
      useFactory: (logger: Logger) => new NestjsLoggerServiceAdapter(logger),
      inject: [LoggerKey],
    },
    {
      provide: WinstonLoggerTransportsKey,
      useFactory: () => {
        const transports: winston.transport[] = [];

        transports.push(ConsoleTransport.createColorize());

        return transports;
      },
      inject: [ConfigService],
    },
  ],
  exports: [LoggerKey, NestjsLoggerServiceAdapter],
})
export class LoggerModule implements NestModule {
  public constructor(
    @Inject(LoggerKey) private logger: Logger,
    private configService: ConfigService,
  ) {}

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        MorganConfig.create(this.logger, this.configService, {
          sourceClass: 'RequestLogger',
          skipHealthCheck: true,
        }),
      )
      .forRoutes('*');
  }
}
