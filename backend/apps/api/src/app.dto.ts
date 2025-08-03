import {
  createSwgResponseType,
  NumberProperty,
  StringProperty,
} from '@tourdeal-backend/shared';

export class ExampleDto {
  @NumberProperty({
    description: '나이',
    example: 30,
    min: 0,
    max: 120,
    integer: true,
    errorKey: 'number.invalid',
    transform: true,
  })
  age: number;

  @StringProperty({
    description: '이름',
    example: '홍길동',
  })
  name: string;
}

export const ExampleResponse = createSwgResponseType(
  'ExampleResponse',
  ExampleDto,
);
