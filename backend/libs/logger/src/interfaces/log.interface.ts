import { LogLevel } from '../enums/log.enum';

export interface Log {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data: LogData;
}

export interface LogData {
  sourceClass?: string; // Classname of the source
  requestId?: string; // Request ID
  error?: Error; // Error object
  props?: NodeJS.Dict<any>; // Additional custom properties
}
