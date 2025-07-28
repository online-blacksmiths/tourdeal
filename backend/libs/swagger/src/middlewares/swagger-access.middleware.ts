import { Inject, Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

import Logger, {
  LoggerKey,
} from '@tourdeal-backend/logger/interfaces/logger.interface';

@Injectable()
export class SwaggerAccessMiddleware implements NestMiddleware {
  constructor(@Inject(LoggerKey) private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.info('Swagger 문서 접근', {
      sourceClass: 'SwaggerAccessMiddleware',
    });

    // 응답 완료 시 로깅
    res.on('finish', () => {
      this.logger.info('Swagger 문서 응답 완료', {
        sourceClass: 'SwaggerAccessMiddleware',
      });
    });
    next();
  }
}
