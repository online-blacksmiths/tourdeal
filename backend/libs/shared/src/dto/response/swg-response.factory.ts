import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { CoreMetadata, CoreResponse } from './core-response.dto';

/**
 * 구체적인 CoreResponse 타입 생성을 위한 Factory
 * 타입 안정성과 Swagger 자동 생성을 보장
 *
 * @example
 * ```typescript
 * // 1. 구체적 타입 생성
 * export const UserCoreResponse = createCoreResponseType('UserCoreResponse', UserDto);
 * export const ProductCoreResponse = createCoreResponseType('ProductCoreResponse', ProductDto);
 *
 * // 2. 컨트롤러에서 사용
 * @ApiOkResponse({ type: UserCoreResponse })
 * async getUser(): Promise<CoreResponse<UserDto>> {
 *   return CoreResponse.success(userData);
 * }
 * ```
 */
export function createSwgResponseType<T>(name: string, dataType: Type<T>) {
  class ConcreteResponse extends CoreResponse<T | null> {
    @ApiProperty({ type: () => CoreMetadata })
    declare meta: CoreMetadata;

    @ApiProperty({
      type: dataType,
      description: '요청 처리에 대한 데이터',
    })
    declare data: T | null;
  }

  // 클래스 이름 설정 (Swagger에서 사용)
  Object.defineProperty(ConcreteResponse, 'name', {
    value: name,
  });

  return ConcreteResponse;
}

/**
 * 배열 데이터를 위한 CoreResponse 타입 생성
 *
 * @example
 * ```typescript
 * export const UserListCoreResponse = createArrayCoreResponseType('UserListCoreResponse', UserDto);
 *
 * @ApiOkResponse({ type: UserListCoreResponse })
 * async getUsers(): Promise<CoreResponse<UserDto[]>> {
 *   return CoreResponse.success(userArray);
 * }
 * ```
 */
export function createArraySwgResponseType<T>(name: string, dataType: Type<T>) {
  class ArrayResponse extends CoreResponse<T[]> {
    @ApiProperty({ type: () => CoreMetadata })
    declare meta: CoreMetadata;

    @ApiProperty({
      type: [dataType],
      description: '요청 처리에 대한 데이터 배열',
    })
    declare data: T[];
  }

  Object.defineProperty(ArrayResponse, 'name', {
    value: name,
  });

  return ArrayResponse;
}

// INFO: Void 응답을 위한 타입 (데이터가 없는 성공 응답)
export class VoidSwgResponse extends CoreResponse<null> {
  @ApiProperty({ type: () => CoreMetadata })
  declare meta: CoreMetadata;

  @ApiProperty({
    type: 'null',
    description: '데이터가 없는 성공 응답',
    example: null,
  })
  declare data: null;
}
