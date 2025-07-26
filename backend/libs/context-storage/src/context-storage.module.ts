import { Global, Module } from '@nestjs/common';

import { ClsModule } from 'nestjs-cls';

import { ContextStorageService } from './context-storage.service';

import { ContextStorageServiceKey } from './interfaces/context-storage.interface';

import { extractRequestId } from './helpers/request-id.helper';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: extractRequestId,
      },
    }),
  ],
  providers: [
    {
      provide: ContextStorageServiceKey,
      useClass: ContextStorageService,
    },
  ],
  exports: [ContextStorageServiceKey],
})
export class ContextStorageModule {}
