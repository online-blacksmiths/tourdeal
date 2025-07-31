import {
  NumberProperty,
  StringProperty,
  UuidProperty,
} from './property.decorator';

import { BaseDecoratorOptions } from './base/decorator.types';
import { normalizePhoneNumber } from './base/decorator.utils';
import { PATTERNS } from './constants';

export function IdProperty(
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  return UuidProperty({
    description: 'Unique identifier for the entity',
    errorKey: 'id.invalid',
    ...options,
  });
}

export function SlugProperty(
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  return StringProperty({
    description: 'Slug for the entity, used in URLs',
    example: 'esample-slug',
    pattern: PATTERNS.SLUG,
    lowercase: true,
    trim: true,
    errorKey: 'slug.invalid',
    ...options,
  });
}

export function KorPhoneProperty(
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  return StringProperty({
    description: 'Korean phone number',
    example: '010-1234-5678',
    pattern: PATTERNS.PHONE_KR,
    transform: (value: string) => {
      if (!value) return value;
      return normalizePhoneNumber(value);
    },
    errorKey: 'phone.invalid',
    ...options,
  });
}

export function DatetimeStringProperty(
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  return StringProperty({
    description: 'Date in ISO 8601 format',
    example: new Date().toISOString(),
    pattern: PATTERNS.ISO_DATETIME,
    errorKey: 'datetime.invalid',
    ...options,
  });
}

export function DateStringProperty(
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  return StringProperty({
    description: 'Date in YYYY-MM-DD format',
    example: new Date().toISOString().split('T')[0],
    pattern: PATTERNS.DATE,
    errorKey: 'date.invalid',
    ...options,
  });
}

export function TimeStringProperty(
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  return StringProperty({
    description: 'Time in HH:mm format',
    example: new Date().toISOString().split('T')[1].slice(0, 8),
    pattern: PATTERNS.TIME,
    errorKey: 'time.invalid',
    ...options,
  });
}

export function PageNumberProperty(
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  return NumberProperty({
    description: 'Page number for pagination',
    example: 1,
    min: 1,
    integer: true,
    optional: true,
    errorKey: 'pagination.page',
    ...options,
  });
}

export function PageLimitProperty(
  options: BaseDecoratorOptions & { max?: number } = {},
): PropertyDecorator {
  const { max = 100, ...restOptions } = options;

  return NumberProperty({
    description: 'Number of items per page for pagination',
    example: 20,
    min: 1,
    max,
    integer: true,
    optional: true,
    errorKey: 'pagination.limit',
    ...restOptions,
  });
}

export function SortProperty<T extends string = string>(
  allowedFields: T[],
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  return StringProperty({
    description: `Sort by field. Prefix with '-' for descending order. Allowed fields: ${allowedFields.join(', ')}`,
    example: '-createdAt',
    pattern: new RegExp(`^-?(${allowedFields.join('|')})$`),
    optional: true,
    errorKey: 'sort.invalid',
    ...options,
  });
}

export function SearchProperty(
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  return StringProperty({
    description: 'Search query string',
    minLength: 1,
    maxLength: 255,
    trim: true,
    optional: true,
    errorKey: 'search.invalid',
    ...options,
  });
}

export function TimestampProperty(
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  return NumberProperty({
    description: 'Unix timestamp in milliseconds',
    example: Date.now(),
    min: 0,
    integer: true,
    errorKey: 'timestamp.invalid',
    ...options,
  });
}
