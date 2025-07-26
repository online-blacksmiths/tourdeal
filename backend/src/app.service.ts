import { Inject, Injectable } from '@nestjs/common';

import Logger, {
  LoggerKey,
} from '@tourdeal-backend/logger/interfaces/logger.interface';

@Injectable()
export class AppService {
  constructor(@Inject(LoggerKey) private logger: Logger) {}
  getHello(): string {
    this.logger.startProfile('getHello');

    return 'Hello World!';
  }

  async printLog(): Promise<string> {
    this.logger.startProfile('printLog');

    // Await random time
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 1000)),
    );

    // Debug
    this.logger.debug(
      'I am a debug message!',
      {
        props: {
          foo: 'bar',
          baz: 'qux',
        },
      },
      'printLog',
    );

    // Info
    this.logger.info(
      'I am an info message!',
      {
        props: {
          foo: 'bar',
          baz: 'qux',
        },
      },
      'printLog',
    );

    // Warn
    this.logger.warn('I am a warn message!', {
      props: {
        foo: 'bar',
        baz: 'qux',
      },
      error: new Error('Hello World!'),
    });

    // Error
    this.logger.error('I am an error message!', {
      props: {
        foo: 'bar',
        baz: 'qux',
      },
      error: new Error('Hello World!'),
    });

    // Fatal
    this.logger.fatal('I am a fatal message!', {
      props: {
        foo: 'bar',
        baz: 'qux',
      },
      error: new Error('Hello World!'),
    });

    // Emergency
    this.logger.emergency('I am an emergency message!', {
      props: {
        foo: 'bar',
        baz: 'qux',
      },
      error: new Error('Hello World!'),
    });

    return 'Check the logs!';
  }
}
