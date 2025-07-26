import { ClsServiceManager } from 'nestjs-cls';
import * as winston from 'winston';

export const addRequestIdToLogger = () => {
  return winston.format((info) => {
    const cls = ClsServiceManager.getClsService();
    const requestId = cls?.getId() || 'SYSTEM';
    if (requestId) {
      info.message = `[${requestId}] ${info.message}`;
    }
    return info;
  })();
};
