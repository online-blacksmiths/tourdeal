import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import {
  DATABASE_CONFIG_TOKEN,
  IDatabaseConfig,
} from '@tourdeal-backend/database';
import NestjsLoggerServiceAdapter from '@tourdeal-backend/logger/infra/nestjs/logger-service.adapter';

import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    const logger = app.get(NestjsLoggerServiceAdapter);
    app.useLogger(logger);

    const dbConfig = app.get<IDatabaseConfig>(DATABASE_CONFIG_TOKEN);
    const isDbConnected = await dbConfig.validateConnection();

    if (!isDbConnected) {
      logger.error('Database connection failed. Exiting application.');
      process.exit(1);
    }

    logger.debug('Database connection established successfully.');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

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
