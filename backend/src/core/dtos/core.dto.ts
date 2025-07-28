import { ApiProperty } from '@nestjs/swagger';

import { IsObject, IsOptional } from 'class-validator';

import {
  BooleanProperty,
  DateProperty,
  NestedProperty,
  StringProperty,
} from '@libs/shared/dto/decorator';

export class CoreMetadata {
  @DateProperty({
    description: '응답이 생성된 시간',
  })
  timestamp: Date = new Date();

  @StringProperty({
    description: '요청의 고유 식별자',
  })
  requestId: string = 'requestId';
}

export class CoreResponse<T> {
  @BooleanProperty()
  result: boolean = true;

  @StringProperty({
    nullable: true,
    optional: true,
  })
  message: string | null = null;

  @ApiProperty({
    type: () => Object,
    nullable: true,
  })
  @IsObject()
  @IsOptional()
  data: T | null = null;

  @NestedProperty({
    type: CoreMetadata,
    description: '응답에 대한 메타데이터',
  })
  meta: CoreMetadata = new CoreMetadata();
}
