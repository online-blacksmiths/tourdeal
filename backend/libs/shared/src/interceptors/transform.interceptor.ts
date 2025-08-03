import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContextStorageService } from '@tourdeal-backend/context-storage/context-storage.service';

import { ContextStorageServiceKey } from '@tourdeal-backend/context-storage/interfaces/context-storage.interface';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  constructor(
    @Inject(ContextStorageServiceKey)
    private readonly contextStorage: ContextStorageService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (data?.meta) {
          data.meta.requestId = this.contextStorage.getRequestId() ?? 'UNKNOWN';
        }
        return data;
      }),
    );
  }
}
