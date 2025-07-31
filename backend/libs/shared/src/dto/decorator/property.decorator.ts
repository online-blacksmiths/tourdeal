import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNegative,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateBy,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { DecoratorFactory } from './base/decorator.factory';
import {
  ArrayDecoratorOptions,
  BaseDecoratorOptions,
  BooleanDecoratorOptions,
  NumberDecoratorOptions,
  StringDecoratorOptions,
} from './base/decorator.types';
import { toBoolean, toNumber, toString } from './base/decorator.utils';

export function StringProperty(
  options: StringDecoratorOptions = {},
): PropertyDecorator {
  const {
    minLength,
    maxLength,
    pattern,
    trim: shouldTrim = false,
    lowercase = false,
    uppercase = false,
    transform = shouldTrim ?? lowercase ?? uppercase,
    ...baseOptions
  } = options;

  const decorators: PropertyDecorator[] = [
    IsString(DecoratorFactory.createValidationOptions(options.errorKey)),
  ];
  if (transform) {
    const transformFn =
      typeof transform === 'function'
        ? transform
        : (value: any) => {
            let result = toString(value);
            if (shouldTrim) result = result.trim();
            if (lowercase) result = result.toLowerCase();
            if (uppercase) result = result.toUpperCase();
            return result;
          };
    decorators.push(
      Transform(({ value }) => transformFn(value), { toClassOnly: true }),
    );
  }

  if (minLength !== undefined) decorators.push(MinLength(minLength));
  if (maxLength !== undefined) decorators.push(MaxLength(maxLength));
  if (pattern) decorators.push(Matches(pattern));

  return DecoratorFactory.createPropertyDecorator(
    String,
    decorators,
    baseOptions,
  );
}

export function NumberProperty(
  options: NumberDecoratorOptions = {},
): PropertyDecorator {
  const {
    min,
    max,
    integer = false,
    positive = false,
    negative = false,
    allowNaN,
    allowInfinity,
    maxDecimalPlaces,
    transform = true,
    ...baseOptions
  } = options;

  const decorators: PropertyDecorator[] = [];

  if (transform) {
    const transformFn =
      typeof transform === 'function'
        ? transform
        : (value: any) => toNumber(value);

    decorators.push(
      Transform(
        ({ value }) => {
          try {
            return transformFn(value);
          } catch {
            return value;
          }
        },
        { toClassOnly: true },
      ),
    );
  }

  if (integer) {
    decorators.push(
      IsInt(DecoratorFactory.createValidationOptions(options.errorKey)),
    );
  } else {
    decorators.push(
      IsNumber(
        { allowNaN, allowInfinity, maxDecimalPlaces },
        DecoratorFactory.createValidationOptions(options.errorKey),
      ),
    );
  }

  if (min !== undefined) decorators.push(Min(min));
  if (max !== undefined) decorators.push(Max(max));
  if (positive) decorators.push(IsPositive());
  if (negative) decorators.push(IsNegative());

  return DecoratorFactory.createPropertyDecorator(
    Number,
    decorators,
    baseOptions,
  );
}

export function BooleanProperty(
  options: BooleanDecoratorOptions = {},
): PropertyDecorator {
  const {
    transform = true,
    strict = false,
    nullable = false,
    falseValues = ['false', '0', 'no', 'n', 'off', ''],
    trueValues = ['true', '1', 'yes', 'y', 'on'],
    ...baseOptions
  } = options;

  const decorators: PropertyDecorator[] = [];

  if (transform) {
    decorators.push(
      Transform(
        ({ value }) => {
          if (nullable && value === null) return null;

          if (!strict) {
            return toBoolean(value);
          }

          if (typeof value === 'boolean') return value;

          if (typeof value === 'string') {
            const lower = value.trim().toLowerCase();
            if (trueValues.includes(lower)) return true;
            if (falseValues.includes(lower)) return false;
            return value;
          }

          return toBoolean(value);
        },
        { toClassOnly: true },
      ),
    );
  }

  if (nullable) {
    decorators.push(
      ValidateBy({
        name: 'isBooleanOrNull',
        validator: {
          validate: (value: any): boolean => {
            return typeof value === 'boolean' || value === null;
          },
          defaultMessage: () => 'Must be a boolean or null',
        },
      }),
    );
  } else {
    decorators.push(
      IsBoolean(DecoratorFactory.createValidationOptions(options.errorKey)),
    );
  }

  return DecoratorFactory.createPropertyDecorator(
    Boolean,
    decorators,
    baseOptions,
  );
}

export function DateProperty(
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  const { transform = true, ...baseOptions } = options;
  const decorators: PropertyDecorator[] = [];

  if (transform) {
    decorators.push(Type(() => Date));
  }

  decorators.push(
    IsDate(DecoratorFactory.createValidationOptions(options.errorKey)),
  );

  return DecoratorFactory.createPropertyDecorator(
    Date,
    decorators,
    baseOptions,
  );
}

export function EmailProperty(
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  const decorators: PropertyDecorator[] = [];

  decorators.push(
    Transform(
      ({ value }) => {
        if (!value) return value;
        return toString(value).toLowerCase().trim();
      },
      { toClassOnly: true },
    ),
  );

  decorators.push(
    IsEmail(
      {},
      DecoratorFactory.createValidationOptions(
        options.errorKey ?? 'email.invalid',
      ),
    ),
  );

  return DecoratorFactory.createPropertyDecorator(String, decorators, {
    ...options,
    description: options.description ?? '이메일 주소',
    example: options.example ?? 'user@example.com',
  });
}

export function ArrayProperty<T = any>(
  options: ArrayDecoratorOptions<T>,
): PropertyDecorator {
  const {
    type,
    minSize,
    maxSize,
    unique = false,
    itemTransform,
    ...baseOptions
  } = options;

  const decorators: PropertyDecorator[] = [];

  // INFO: 배열 변환 처리
  decorators.push(
    Transform(
      ({ value }) => {
        if (value === undefined || value === null) return value;
        const array = Array.isArray(value) ? value : [value];
        return itemTransform ? array.map(itemTransform) : array;
      },
      { toClassOnly: true },
    ),
  );
  // INFO: Type변환 (primitive가 아닌 경우)
  const elementType = type();
  if (!isPrimitiveType(elementType)) {
    decorators.push(Type(type));
  }

  decorators.push(
    IsArray(DecoratorFactory.createValidationOptions(options.errorKey)),
  );

  if (minSize !== undefined) decorators.push(ArrayMinSize(minSize));
  if (maxSize !== undefined) decorators.push(ArrayMaxSize(maxSize));
  if (unique) decorators.push(ArrayUnique());

  // INFO: 배열 요소 검증
  if (isPrimitiveType(elementType)) {
    const validator = getPrimitiveValidator(elementType);
    if (validator) decorators.push(validator);
  } else {
    decorators.push(ValidateNested({ each: true }));
  }

  return DecoratorFactory.createPropertyDecorator(
    [elementType],
    decorators,
    baseOptions,
  );
}

export function EnumProperty<T extends Record<string, any>>(
  enumType: T,
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  const decorators: PropertyDecorator[] = [
    IsEnum(
      enumType,
      DecoratorFactory.createValidationOptions(
        options.errorKey ?? 'enum.invalid',
        {
          message:
            '유효하지 않은 값입니다. 허용된 값: ' +
            Object.values(enumType).join(', '),
        },
      ),
    ),
  ];

  return DecoratorFactory.createPropertyDecorator(enumType, decorators, {
    ...options,
    example: options.example ?? Object.values(enumType)[0],
  });
}

export function UuidProperty(
  options: BaseDecoratorOptions & { version?: '3' | '4' | '5' | 'all' } = {},
): PropertyDecorator {
  const { version = '4', ...baseOptions } = options;

  const decorators: PropertyDecorator[] = [
    IsUUID(
      version,
      DecoratorFactory.createValidationOptions(
        options.errorKey ?? 'uuid.invalid',
      ),
    ),
  ];

  return DecoratorFactory.createPropertyDecorator(String, decorators, {
    ...baseOptions,
    description: baseOptions.description ?? `UUID v${version}`,
    example: baseOptions.example ?? '550e8400-e29b-41d4-a716-446655440000',
  });
}

export function NestedProperty<T = any>(
  type: () => new (...args: any[]) => T,
  options: BaseDecoratorOptions = {},
): PropertyDecorator {
  const decorators: PropertyDecorator[] = [
    Type(type),
    ValidateNested(DecoratorFactory.createValidationOptions(options.errorKey)),
  ];

  return DecoratorFactory.createPropertyDecorator(type, decorators, options);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function GenericProperty<T = any>(
  options: BaseDecoratorOptions & {
    type?: () => any;
    isArray?: boolean;
    transform?: boolean | ((value: any) => any);
    validateType?: boolean;
  } = {},
): PropertyDecorator {
  const {
    type,
    isArray = false,
    transform = true,
    validateType = true,
    ...baseOptions
  } = options;

  const decorators: PropertyDecorator[] = [];

  // INFO: nullable, optional 처리
  if (options.nullable || options.optional) {
    decorators.push(
      ValidateIf((obj, value) => value !== null && value !== undefined),
    );
  }

  // INFO: Transform 처리
  if (transform) {
    const transformFn =
      typeof transform === 'function' ? transform : (value: any) => value;

    decorators.push(
      Transform(
        ({ value }) => {
          if (value === undefined || value === null) return value;
          if (isArray) {
            const array = Array.isArray(value) ? value : [value];
            return array.map(transformFn);
          }

          return transformFn(value);
        },
        { toClassOnly: true },
      ),
    );
  }

  // INFO: Type 변환 (primitive가 아닌 경우)
  const elementType = type ? type() : Object;
  if (type && !isPrimitiveType(elementType)) {
    decorators.push(Type(type));
  }

  // INFO: 배열 검증
  if (isArray) {
    decorators.push(
      IsArray(DecoratorFactory.createValidationOptions(options.errorKey)),
    );
  }

  // INFO: 타입별 검증
  if (validateType) {
    if (!type) {
      decorators.push(IsObject());
    } else if (isArray) {
      if (isPrimitiveType(elementType)) {
        const validator = getPrimitiveValidator(elementType);
        if (validator) decorators.push(validator);
      } else {
        decorators.push(ValidateNested({ each: true }));
      }
    } else {
      if (isPrimitiveType(elementType)) {
        const validator = getPrimitiveValidator(elementType);
        if (validator) decorators.push(validator);
      } else {
        decorators.push(
          ValidateNested(
            DecoratorFactory.createValidationOptions(options.errorKey),
          ),
        );
      }
    }
  }

  const swaggerType = elementType;

  return DecoratorFactory.createPropertyDecorator(
    isArray ? [swaggerType] : swaggerType,
    decorators,
    {
      ...baseOptions,
      type: type ?? (() => Object),
    },
  );
}

function isPrimitiveType(type: any): boolean {
  return [String, Number, Boolean, Date].includes(type);
}

function getPrimitiveValidator(type: any): PropertyDecorator | null {
  const validationOptions = { each: true };
  const validatorMap: Record<string, () => PropertyDecorator> = {
    String: () => IsString(validationOptions),
    Number: () => IsNumber({}, validationOptions),
    Boolean: () => IsBoolean(validationOptions),
    Date: () => IsDate(validationOptions),
  };

  const validatorFactory = validatorMap[type.name];
  return validatorFactory ? validatorFactory() : null;
}
