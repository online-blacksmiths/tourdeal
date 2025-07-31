// libs/shared/src/dto/decorator/constants.ts
export const ERROR_MESSAGES: Record<
  string,
  { message: string; description?: string }
> = {
  // 기본 타입
  'string.invalid': {
    message: '문자열이어야 합니다',
    description: '문자열 값',
  },
  'number.invalid': {
    message: '숫자여야 합니다',
    description: '숫자 값',
  },
  'boolean.invalid': {
    message: '불리언이어야 합니다',
    description: '참/거짓 값',
  },

  // 특정 형식
  'email.invalid': {
    message: '유효한 이메일 주소가 아닙니다',
    description: '이메일 주소',
  },
  'phone.invalid': {
    message: '유효한 전화번호 형식이 아닙니다',
    description: '전화번호 (010-1234-5678)',
  },
  'datetime.invalid': {
    message: '날짜와 시간은 ISO 8601 형식이어야 합니다',
    description: '날짜와 시간 (YYYY-MM-DDTHH:mm:ssZ)',
  },
  'date.invalid': {
    message: '날짜는 YYYY-MM-DD 형식이어야 합니다',
    description: '날짜 (YYYY-MM-DD)',
  },
  'time.invalid': {
    message: '시간은 HH:mm:ss 형식이어야 합니다',
    description: '시간 (HH:mm:ss)',
  },
  'id.invalid': {
    message: '유효한 ID 형식이 아닙니다',
    description: 'UUID 형식의 고유 식별자',
  },
  'slug.invalid': {
    message: '유효한 슬러그 형식이 아닙니다 (소문자, 숫자, 하이픈만 허용)',
    description: 'URL 친화적 식별자',
  },

  // 페이지네이션
  'pagination.page': {
    message: '페이지 번호는 1 이상이어야 합니다',
    description: '페이지 번호',
  },
  'pagination.limit': {
    message: '페이지당 항목 수는 1 이상이어야 합니다',
    description: '페이지당 항목 수',
  },

  // 기타
  'enum.invalid': {
    message: '허용된 값 중 하나여야 합니다',
    description: '열거형 값',
  },
  'array.invalid': {
    message: '배열이어야 합니다',
    description: '배열',
  },
  'sort.invalid': {
    message: '유효한 정렬 필드가 아닙니다',
    description: '정렬 기준',
  },
  'search.invalid': {
    message: '검색어를 입력해주세요',
    description: '검색어',
  },
  'timestamp.invalid': {
    message: '유효한 타임스탬프가 아닙니다',
    description: '유닉스 타임스탬프 (밀리초)',
  },
};

// 공통 정규식 패턴
export const PATTERNS = {
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  PHONE_KR: /^(\+82|0)?(1[0-9]{1})-?([0-9]{3,4})-?([0-9]{4})$/,
  DATE: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  TIME: /^(?:2[0-3]|[01]\d):[0-5]\d:[0-5]\d$/,
  ISO_DATETIME:
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:(Z)|([+-]\d{2}:\d{2}))$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;
