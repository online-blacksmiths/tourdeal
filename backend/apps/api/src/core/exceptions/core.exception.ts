import { HttpException, HttpStatus } from '@nestjs/common';

import { CoreResponse } from 'libs/shared/src/dto/response';

export class CoreHttpException<T> extends HttpException {
  constructor(response: Partial<CoreResponse<T>>, status: HttpStatus) {
    super(response, status);
  }
}
