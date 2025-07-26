import { NestFactory } from '@nestjs/core';

import NestjsLoggerServiceAdapter from '@tourdeal-backend/logger/infra/nestjs/logger-service.adapter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(NestjsLoggerServiceAdapter));
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
