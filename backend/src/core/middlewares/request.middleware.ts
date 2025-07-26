import { Inject, Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

import { ContextStorageService } from '@tourdeal-backend/context-storage/context-storage.service';

import { ContextStorageServiceKey } from '@tourdeal-backend/context-storage/interfaces/context-storage.interface';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(
    @Inject(ContextStorageServiceKey)
    private readonly context: ContextStorageService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = this.context.getRequestId();

    if (requestId) {
      res.setHeader('X-Request-Id', requestId);
    }

    next();
  }
}
