import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

import { ContextStorageService } from '@tourdeal-backend/context-storage/context-storage.service';

import { LogData } from './interfaces/log.interface';
import Logger, { LoggerBaseKey } from './interfaces/logger.interface';
import { ContextStorageServiceKey } from '@tourdeal-backend/context-storage/interfaces/context-storage.interface';

import { LogLevel } from './enums/log.enum';

@Injectable({ scope: Scope.TRANSIENT })
export default class LoggerService implements Logger {
  private sourceClass: string;

  public constructor(
    @Inject(LoggerBaseKey) private logger: Logger,
    @Inject(INQUIRER) parentClass: object,
    @Inject(ContextStorageServiceKey)
    private contextStorageService: ContextStorageService,
  ) {
    this.sourceClass = parentClass?.constructor?.name;
  }

  public log(
    level: LogLevel,
    message: string | Error,
    data?: LogData,
    profile?: string,
  ) {
    return this.logger.log(level, message, this.getLogData(data), profile);
  }

  public debug(message: string, data?: LogData, profile?: string) {
    return this.logger.debug(message, this.getLogData(data), profile);
  }

  public info(message: string, data?: LogData, profile?: string) {
    return this.logger.info(message, this.getLogData(data), profile);
  }

  public warn(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.warn(message, this.getLogData(data), profile);
  }

  public error(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.error(message, this.getLogData(data), profile);
  }

  public fatal(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.fatal(message, this.getLogData(data), profile);
  }

  public emergency(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.emergency(message, this.getLogData(data), profile);
  }

  private getLogData(data?: LogData): LogData {
    return {
      ...data,
      sourceClass: data?.sourceClass ?? this.sourceClass,
      requestId: data?.requestId ?? this.contextStorageService.getRequestId(),
    };
  }

  public startProfile(id: string): void {
    this.logger.startProfile(id);
  }
}
