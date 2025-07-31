import {
  BooleanProperty,
  DatetimeStringProperty,
  GenericProperty,
  NestedProperty,
  StringProperty,
} from '../decorator';

export class CoreMetadata {
  @DatetimeStringProperty({ description: '응답이 생성된 시간' })
  timestamp: Date = new Date();

  @StringProperty({ description: '요청의 고유 식별자', example: 'requestId' })
  requestId: string = 'requestId';
}

export class CoreResponse<T> {
  @BooleanProperty({ description: '요청 처리 결과' })
  result: boolean = true;

  @StringProperty({
    nullable: true,
    description: '요청 처리 메시지, ok 상황일때 null 반환',
  })
  message: string | null = null;

  @GenericProperty({
    nullable: true,
    description: '요청 처리에 대한 데이터',
  })
  data: T | null = null;

  @NestedProperty(() => CoreMetadata, { description: '메타데이터' })
  meta: CoreMetadata = new CoreMetadata();
}
