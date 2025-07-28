export const ContextStorageServiceKey = Symbol();

export default interface IContextStorageService {
  setRequestId(contextId: string): void;
  getRequestId(): string | undefined;
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
}
