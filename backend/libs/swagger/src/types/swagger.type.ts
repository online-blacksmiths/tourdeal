export type SwaggerEnvironment = 'development' | 'staging' | 'production';

export interface SwaggerInfo {
  title: string;
  description: string;
  version: string;
  contact?: {
    name?: string;
    email?: string;
    url?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
}

export interface SwaggerServer {
  url: string;
  description: string;
}

export interface ApiResponseOptions {
  status: number;
  description: string;
  type?: any;
  isArray?: boolean;
}
