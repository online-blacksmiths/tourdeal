import { ConfigService } from '@nestjs/config';

import * as morgan from 'morgan';

import Logger from '@tourdeal-backend/logger/interfaces/logger.interface';

export interface MorganOptions {
  sourceClass?: string;
  skipHealthCheck?: boolean;
}

export class MorganConfig {
  public static create(
    logger: Logger,
    configService: ConfigService,
    opts: MorganOptions = {},
  ) {
    const { sourceClass = 'RequestLogger', skipHealthCheck = false } = opts;
    const isProd = configService.get<string>('NODE_ENV') === 'prod';

    const morganOptions: any = {
      stream: {
        write: (message: string) => {
          const trimmedMessage = message.trim();
          if (trimmedMessage) {
            logger.debug(message.trim(), { sourceClass });
          }
        },
      },
    };

    if (skipHealthCheck) {
      morganOptions.skip = (req: any, res: any) => {
        return req.url === '/health' || req.url === '/metrics';
      };
    }

    return morgan((tokens, req, res) => {
      const status = parseInt(tokens.status(req, res) || '0');
      const method = tokens.method(req, res);
      const url = tokens.url(req, res);
      const responseTime = tokens['response-time'](req, res);
      const contentLength = tokens.res(req, res, 'content-length') || '0';
      const remoteAddr = tokens['remote-addr'](req, res);

      const logMessage = `${remoteAddr} - "${method} ${url}" ${status} ${contentLength} - ${responseTime}ms`;

      // Log based on status code level
      if (status >= 500) {
        logger.error(logMessage, { sourceClass });
      } else if (status >= 400) {
        logger.warn(logMessage, { sourceClass });
      } else {
        if (isProd) {
          logger.info(logMessage, { sourceClass });
        } else {
          logger.debug(logMessage, { sourceClass });
        }
      }

      // Return empty string since we're handling logging directly
      return '';
    }, morganOptions);
  }
}
