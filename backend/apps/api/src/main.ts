import { NestFactory } from '@nestjs/core';

import NestjsLoggerServiceAdapter from '@tourdeal-backend/logger/infra/nestjs/logger-service.adapter';

import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    app.useLogger(app.get(NestjsLoggerServiceAdapter));

    if (process.env.NODE_ENV !== 'prod') {
      const { SwaggerService } = await import(
        '@tourdeal-backend/swagger/swagger.service'
      );
      const swaggerService = app.get(SwaggerService);
      swaggerService.setupSwagger(app);
    }
    await app.listen(process.env.PORT ?? 8080);
  } catch (error) {
    console.error('Failed to bootstrap the application:', error);
    process.exit(1); // Exit the process with a failure code
  }
}
bootstrap();
