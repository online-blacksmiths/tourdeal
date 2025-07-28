import { LogLevel } from '@tourdeal-backend/logger/enums/log.enum';

import { LogData } from '@tourdeal-backend/logger/interfaces/log.interface';
import Logger, {
  LoggerKey,
} from '@tourdeal-backend/logger/interfaces/logger.interface';

/**
 * 테스트용 Mock Logger 구현
 * 모든 로그 메서드를 Jest mock 함수로 구현하여 테스트에서 호출 검증 가능
 */
export class MockLogger implements Logger {
  public log = jest.fn();
  public debug = jest.fn();
  public info = jest.fn();
  public warn = jest.fn();
  public error = jest.fn();
  public fatal = jest.fn();
  public emergency = jest.fn();
  public startProfile = jest.fn();

  /**
   * 모든 mock 함수의 호출 기록을 초기화
   */
  public clearAllMocks(): void {
    this.log.mockClear();
    this.debug.mockClear();
    this.info.mockClear();
    this.warn.mockClear();
    this.error.mockClear();
    this.fatal.mockClear();
    this.emergency.mockClear();
    this.startProfile.mockClear();
  }

  /**
   * 특정 로그 레벨의 호출 횟수 반환
   */
  public getCallCount(method: keyof MockLogger): number {
    const mockFn = this[method];
    return typeof mockFn === 'function' && jest.isMockFunction(mockFn)
      ? mockFn.mock.calls.length
      : 0;
  }
}

/**
 * NestJS 테스트 모듈에서 사용할 Mock Logger Provider
 * LoggerKey Symbol을 사용하여 의존성 주입
 */
export const createMockLoggerProvider = () => ({
  provide: LoggerKey,
  useValue: new MockLogger(),
});

/**
 * 테스트에서 Mock Logger 인스턴스를 쉽게 가져오기 위한 헬퍼 함수
 */
export const getMockLogger = (testingModule: any): MockLogger => {
  return testingModule.get(LoggerKey);
};
