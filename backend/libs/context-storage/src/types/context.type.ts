export type ContextKey = string;
export type ContextValue<T = any> = T;

export interface ContextStorageOptions {
  generateId?: boolean;
  keyPrefix?: string;
}

export interface RequestContext {
  requestId?: string;
  userId?: string;
  traceId?: string;
  userAgent?: string;
  ip?: string;
  timestamp?: Date;
}
