import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

export interface ISwaggerConfig {
  getDocumentBuilder(): DocumentBuilder;
  getDocumentOptions(): SwaggerDocumentOptions;
  getSwaggerPath(): string;
  isEnabled(): boolean;
}

export const SWAGGER_CONFIG_TOKEN = Symbol('SWAGGER_CONFIG_TOKEN');
