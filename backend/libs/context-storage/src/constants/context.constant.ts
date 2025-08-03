export const CONTEXT_STORAGE_CONSTANTS = {
  REQUEST_ID_KEY: 'requestId',
  USER_ID_KEY: 'userId',
  TRACE_ID_KEY: 'traceId',
  USER_AGENT_KEY: 'userAgent',
  IP_ADDRESS_KEY: 'ipAddress',
  TIMESTAMP_KEY: 'timestamp',
} as const;

export const CONTEXT_PREFIXES = {
  REQUEST: 'req',
  USER: 'user',
  TRACE: 'trace',
  SESSION: 'session',
} as const;

export const DEFAULT_CONTEXT_OPTIONS = {
  generateId: true,
  keyPrefix: CONTEXT_PREFIXES.REQUEST,
} as const;
