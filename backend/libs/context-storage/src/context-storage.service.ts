import { Injectable } from '@nestjs/common';

import { CLS_ID, ClsService } from 'nestjs-cls';

import IContextStorageService from './interfaces/context-storage.interface';

@Injectable()
export class ContextStorageService implements IContextStorageService {
  constructor(private readonly cls: ClsService) {}

  public get<T>(key: string): T | undefined {
    return this.cls.get(key);
  }

  public setRequestId(id: string) {
    this.cls.set(CLS_ID, id);
  }

  public getRequestId(): string | undefined {
    return this.cls.getId();
  }

  public set<T>(key: string, value: T): void {
    this.cls.set(key, value);
  }
}
