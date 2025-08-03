import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { COMMON_RESPONSES } from '../constants/swagger.constant';

export function ApiEndpoint(summary: string, description?: string) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiResponse(COMMON_RESPONSES.SUCCESS),
    ApiResponse(COMMON_RESPONSES.BAD_REQUEST),
    ApiResponse(COMMON_RESPONSES.INTERNAL_ERROR),
  );
}

export function ApiCrudEndpoint(summary: string, description?: string) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiResponse(COMMON_RESPONSES.SUCCESS),
    ApiResponse(COMMON_RESPONSES.CREATED),
    ApiResponse(COMMON_RESPONSES.BAD_REQUEST),
    ApiResponse(COMMON_RESPONSES.NOT_FOUND),
    ApiResponse(COMMON_RESPONSES.INTERNAL_ERROR),
  );
}

export function ApiAuthEndpoint(summary: string, description?: string) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiResponse(COMMON_RESPONSES.SUCCESS),
    ApiResponse(COMMON_RESPONSES.BAD_REQUEST),
    ApiResponse(COMMON_RESPONSES.UNAUTHORIZED),
    ApiResponse(COMMON_RESPONSES.INTERNAL_ERROR),
  );
}

export function ApiTaggedEndpoint(
  tag: string,
  summary: string,
  description?: string,
) {
  return applyDecorators(
    ApiTags(tag),
    ApiOperation({ summary, description }),
    ApiResponse(COMMON_RESPONSES.SUCCESS),
    ApiResponse(COMMON_RESPONSES.BAD_REQUEST),
    ApiResponse(COMMON_RESPONSES.INTERNAL_ERROR),
  );
}
