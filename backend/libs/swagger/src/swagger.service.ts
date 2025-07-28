import { INestApplication, Inject, Injectable } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import Logger, {
  LoggerKey,
} from '@tourdeal-backend/logger/interfaces/logger.interface';

@Injectable()
export class SwaggerService {
  constructor(@Inject(LoggerKey) private readonly logger: Logger) {}

  public setupSwagger(app: INestApplication): void {
    // const expressApp = app.getHttpAdapter().getInstance();
    // expressApp.use('/docs', (req: any, res: any, next: any) => {
    //   this.logger.info('Swagger 문서 접근', {
    //     sourceClass: 'SwaggerService',
    //   });
    //   next();
    // });
    try {
      const config = new DocumentBuilder()
        .setTitle('Tourdeal Backend API')
        .setDescription('Tourdeal Backend Application API Document')
        .setVersion('1.0')
        .build();
      const document = SwaggerModule.createDocument(app, config);
      const opts: SwaggerCustomOptions = {
        swaggerOptions: {
          docExpansion: 'list',
          filter: true,
          showRequestDuration: true,
          deepLinking: true,
          defaultModelsExpandDepth: 5,
        },
      };
      SwaggerModule.setup('docs', app, document, opts);
      this.logger.info('Swagger 문서 설정이 성공적으로 완료되었습니다. /docs', {
        sourceClass: 'SwaggerService',
      });
    } catch (error) {
      this.logger.error('Swagger 문서 설정에 실패했습니다', {
        sourceClass: 'SwaggerService',
      });
      throw error; // Re-throw the error after logging
    }
  }
}
