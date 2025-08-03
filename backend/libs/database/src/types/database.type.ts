export type DatabaseEnvironment = 'local' | 'dev' | 'prod' | 'test';

export type ConnectionStatus =
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'connecting';

export interface DatabaseConnectionInfo {
  host: string;
  port: number;
  database: string;
  status: ConnectionStatus;
  lastConnected?: Date;
}
