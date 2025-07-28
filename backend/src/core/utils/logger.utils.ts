import { ClsServiceManager } from 'nestjs-cls';
import * as winston from 'winston';

/**
 * 안전하게 값을 문자열로 변환하는 유틸리티 함수
 * @param value - 변환할 값
 * @returns 안전하게 변환된 문자열
 */
const safeStringify = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (value === null) {
    return 'null';
  }
  if (value === undefined) {
    return 'undefined';
  }
  if (value instanceof Error) {
    return value.message;
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '[Circular Object]';
    }
  }
  // fallback: 알 수 없는 타입의 경우 타입을 포함해서 안전하게 처리
  return `[${typeof value}: ${Object.prototype.toString.call(value)}]`;
};

export const addRequestIdToLogger = () => {
  return winston.format((info) => {
    const cls = ClsServiceManager.getClsService();
    const requestId = cls?.getId() ?? 'SYSTEM';
    if (requestId) {
      const messageStr = safeStringify(info.message);
      info.message = `[${requestId}] ${messageStr}`;
    }
    return info;
  })();
};
