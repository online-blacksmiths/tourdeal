import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { ContextStorageService } from '@tourdeal-backend/context-storage/context-storage.service';

import { ContextStorageServiceKey } from '@tourdeal-backend/context-storage/interfaces/context-storage.interface';
import Logger, {
  LoggerKey,
} from '@tourdeal-backend/logger/interfaces/logger.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(LoggerKey) private readonly logger: Logger,
    @Inject(ContextStorageServiceKey)
    private readonly contextStorage: ContextStorageService,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionRes = exception.getResponse() as Record<string, unknown>;
    const errMsg =
      typeof exceptionRes === 'string'
        ? exceptionRes
        : ((exceptionRes as any)?.message ?? exception.message);

    const logLevel = status >= 500 ? 'error' : 'warn';

    this.logger[logLevel](`${request.method} ${request.url} (${status})`, {
      sourceClass: 'HttpExceptionFilter',
      requestId: this.contextStorage.getRequestId() ?? 'UNKNOWN',
      error: errMsg,
      stack: logLevel === 'error' ? exception.stack : '',
    });

    response.status(status).json({
      result: exceptionRes.result ?? false,
      message: exceptionRes.message ?? '오류가 발생했습니다',
      data: exceptionRes.data ?? null,
    });
  }
}
