/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { LogLevel } from '@tourdeal-backend/logger/enums/log.enum';
import * as winston from 'winston';

import { LogColors } from '../enums/winston.enum';

export default class ConsoleTransport {
  public static createColorize() {
    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf((log) => {
          const logData: any = log.data;
          const color = this.logLevelColorMap(log.level as LogLevel);

          const prefix = logData.label
            ? this.colorize(color, `[${logData.label}] - `)
            : '';
          const requestId = this.colorize(
            LogColors.cyan,
            `(${logData.requestId ? logData.requestId : 'SYSTEM'})`,
          );
          const level = this.colorize(color, log.level.toUpperCase());
          const sourceClass = logData.sourceClass
            ? this.colorize(LogColors.yellow, `[${logData.sourceClass}]`)
            : '';
          const message = log.message
            ? this.colorize(color, `${log.message}`)
            : '';
          const durationMs = this.colorize(
            color,
            (() => {
              if (logData.durationMs !== undefined) {
                return ` +${logData.durationMs}ms`;
              }
              return '';
            })(),
          );
          const errorMsg = logData.error
            ? this.colorize(color, `\n - Error Message: \n${logData.error}`)
            : '';

          const stack = logData.stack
            ? this.colorize(
                LogColors.error,
                `\n - Error Stack: \n${logData.stack}`,
              )
            : '';
          const props = logData.props
            ? `\n - Props: \n${JSON.stringify(logData.props, null, 4)}`
            : '';

          return `${prefix} ${log.timestamp} ${requestId} ${level} ${sourceClass} ${message} ${durationMs}${errorMsg}${stack}${props}`;
        }),
      ),
    });
  }

  private static colorize(color: LogColors, message: string): string {
    return `${color}${message}\x1b[0m`;
  }

  private static logLevelColorMap(level: LogLevel): LogColors {
    switch (level) {
      case LogLevel.Debug:
        return LogColors.blue;
      case LogLevel.Info:
        return LogColors.green;
      case LogLevel.Warn:
        return LogColors.orange;
      case LogLevel.Error:
        return LogColors.red;
      case LogLevel.Fatal:
        return LogColors.magenta;
      case LogLevel.Emergency:
        return LogColors.pink;
      default:
        return LogColors.cyan;
    }
  }
}
