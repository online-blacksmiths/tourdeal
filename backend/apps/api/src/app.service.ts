import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import Logger, {
  LoggerKey,
} from '@tourdeal-backend/logger/interfaces/logger.interface';

import { ExampleDto } from './app.dto';

import { CoreHttpException } from './core/exceptions/core.exception';

@Injectable()
export class AppService {
  constructor(@Inject(LoggerKey) private logger: Logger) {}
  getHello(): string {
    this.logger.startProfile('getHello');

    return 'Hello World!';
  }

  getExcpetion() {
    try {
      throw new Error('예외가 발생했습니다!');
    } catch (e) {
      throw new CoreHttpException(
        {
          message: e.message ?? '오류가 발생했습니다',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async printLog(): Promise<string> {
    this.logger.startProfile('printLog');

    // 랜덤 시간 대기
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 1000)),
    );

    // 디버그
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

    // 정보
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

    // 경고
    this.logger.warn('I am a warn message!', {
      props: {
        foo: 'bar',
        baz: 'qux',
      },
      error: new Error('Hello World!'),
    });

    // 오류
    this.logger.error('I am an error message!', {
      props: {
        foo: 'bar',
        baz: 'qux',
      },
      error: new Error('Hello World!'),
    });

    // 치명적 오류
    this.logger.fatal('I am a fatal message!', {
      props: {
        foo: 'bar',
        baz: 'qux',
      },
      error: new Error('Hello World!'),
    });

    // 비상상황
    this.logger.emergency('I am an emergency message!', {
      props: {
        foo: 'bar',
        baz: 'qux',
      },
      error: new Error('Hello World!'),
    });

    return '로그를 확인하세요!';
  }

  getCoreResponse(): ExampleDto {
    return {
      name: 'bar',
      age: 1,
    };
  }
}
