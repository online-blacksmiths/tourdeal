import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsNumber,
  IsNumberOptions,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

type DecoratorOption = {
  name?: string;
  nullable?: boolean;
  description?: string;
  optional?: boolean;
  type?: object;
  example?: string | number | boolean;
  message?: string;
  transform?: boolean;
};

type StringDecoratorOption = DecoratorOption & {
  minLength?: number;
  maxLength?: number;
};

type NumberDecoratorOption = DecoratorOption &
  IsNumberOptions & {
    min?: number;
    max?: number;
  };

type SpecificTypeDecoratorOption = {
  name?: string;
  nullable?: boolean;
  description?: string;
  optional?: boolean;
  type: new () => any;
  example?: any;
  message?: string;
  validationOptions?: Record<string, any>;
};

export function Optional(optional: boolean): PropertyDecorator {
  const swaggerOption = optional
    ? applyDecorators(ApiPropertyOptional())
    : applyDecorators();
  const validatorOption = optional
    ? applyDecorators(IsOptional())
    : applyDecorators();
  return applyDecorators(swaggerOption, validatorOption);
}

export function StringProperty(
  options: StringDecoratorOption = {},
): PropertyDecorator {
  const { nullable = false, optional = false, minLength, maxLength } = options;

  const swaggerMainOption = applyDecorators(
    ApiProperty({
      name: options.name,
      nullable: nullable,
      type: String,
      description: options.description,
      example: options.example,
      minLength,
      maxLength,
    }),
  );
  const validatorMainOption = applyDecorators(
    IsString({
      message: options.message,
    }),
    ...(minLength !== undefined ? [MinLength(minLength)] : []),
    ...(maxLength !== undefined ? [MaxLength(maxLength)] : []),
    ...(minLength !== undefined && maxLength !== undefined
      ? [Length(minLength, maxLength)]
      : []),
  );
  const optionalOption = Optional(optional);

  return applyDecorators(
    ...(options.transform ? [Type(() => String)] : []),
    swaggerMainOption,
    validatorMainOption,
    optionalOption,
  );
}

export function NumberStringProperty(
  options: DecoratorOption = {},
): PropertyDecorator {
  const { nullable = false, optional = false, example = '123' } = options;

  const swaggerMainOption = applyDecorators(
    ApiProperty({
      name: options.name,
      nullable: nullable,
      type: String,
      description: options.description,
      example: example,
    }),
  );

  const validatorMainOption = applyDecorators(
    IsNumberString(
      {},
      {
        message: options.message,
      },
    ),
  );
  const optionalOption = Optional(optional);

  return applyDecorators(
    ...(options.transform ? [Type(() => String)] : []),
    swaggerMainOption,
    validatorMainOption,
    optionalOption,
  );
}

export function NumberProperty(
  options: NumberDecoratorOption = {},
): PropertyDecorator {
  const {
    nullable = false,
    optional = false,
    allowNaN,
    allowInfinity,
    maxDecimalPlaces,
    min,
    max,
  } = options;

  const swaggerMainOption = applyDecorators(
    ApiProperty({
      name: options.name,
      nullable,
      type: Number,
      description: options.description,
      example: options.example,
      minimum: min,
      maximum: max,
    }),
  );

  const isNumberOptions: IsNumberOptions = {
    ...(allowNaN !== undefined && { allowNaN }),
    ...(allowInfinity !== undefined && { allowInfinity }),
    ...(maxDecimalPlaces !== undefined && { maxDecimalPlaces }),
  };

  const validatorMainOption = applyDecorators(
    IsNumber(isNumberOptions, {
      message: options.message,
    }),
    ...(min !== undefined ? [Min(min)] : []),
    ...(max !== undefined ? [Max(max)] : []),
  );

  const optionalOption = Optional(optional);

  return applyDecorators(
    ...(options.transform ? [Type(() => Number)] : []),
    swaggerMainOption,
    validatorMainOption,
    optionalOption,
  );
}

export function IntegerProperty(
  options: DecoratorOption = {},
): PropertyDecorator {
  const { nullable = false, optional = false } = options;

  const swaggerMainOption = applyDecorators(
    ApiProperty({
      name: options.name,
      nullable: nullable,
      type: Number,
      description: options.description,
      example: options.example,
    }),
  );
  const validatorMainOption = applyDecorators(
    IsInt({
      message: options.message,
    }),
  );
  const optionalOption = Optional(optional);

  return applyDecorators(
    ...(options.transform ? [Type(() => Number)] : []),
    swaggerMainOption,
    validatorMainOption,
    optionalOption,
  );
}

export function DateProperty(options: DecoratorOption = {}): PropertyDecorator {
  const { nullable = false, optional = false } = options;

  const swaggerMainOption = applyDecorators(
    ApiProperty({
      name: options.name,
      nullable: nullable,
      type: Date,
      description: options.description,
      example: options.example,
    }),
  );
  const validatorMainOption = applyDecorators(
    IsDate({
      message: options.message,
    }),
  );
  const optionalOption = Optional(optional);

  return applyDecorators(
    ...(options.transform ? [Type(() => Date)] : []),
    swaggerMainOption,
    validatorMainOption,
    optionalOption,
  );
}

function toBoolean(value: boolean | string | number): boolean {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
}

export function BooleanProperty(
  options: DecoratorOption = {},
): PropertyDecorator {
  const { nullable = false, optional = false } = options;

  const swaggerMainOption = applyDecorators(
    ApiProperty({
      name: options.name,
      nullable: nullable,
      type: Boolean,
      description: options.description,
      example: options.example,
    }),
  );
  const validatorMainOption = applyDecorators(
    IsBoolean({
      message: options.message,
    }),
  );
  const optionalOption = Optional(optional);

  return applyDecorators(
    ...(options.transform
      ? [
          Transform(
            ({ value }: { value: unknown }) =>
              toBoolean(value as boolean | string | number),
            { toClassOnly: true },
          ),
        ]
      : []),
    swaggerMainOption,
    validatorMainOption,
    optionalOption,
  );
}

const validationOptionMap: Record<
  string,
  (validationOptions?: Record<string, any>) => PropertyDecorator
> = {
  String: (validationOptions = {}) =>
    IsString({ each: true, ...validationOptions }),
  Number: (validationOptions = {}) =>
    IsNumber(validationOptions, { each: true }),
  Boolean: (validationOptions = {}) =>
    IsBoolean({ each: true, ...validationOptions }),
  Email: (validationOptions = {}) => IsEmail(validationOptions, { each: true }),
};

export function ArrayProperty(
  options: SpecificTypeDecoratorOption,
): PropertyDecorator {
  const {
    nullable = false,
    optional = false,
    validationOptions = {},
  } = options;

  const swaggerMainOption = applyDecorators(
    ApiProperty({
      name: options.name,
      nullable: nullable,
      description: options.description,
      type: [options.type],
      example: options.example,
    }),
  );

  const typeName = options.type.name;
  const validationFactory = validationOptionMap[typeName];

  let dataTypeDecorator = ValidateNested({
    each: true,
    message: options.message,
  });

  if (validationFactory) {
    dataTypeDecorator = validationFactory(validationOptions);
  }

  const validatorMainOption = applyDecorators(IsArray(), dataTypeDecorator);

  // INFO: 단일원소를 배열로 감싸줍니다.
  const transformToArray = Transform(({ value }: { value: unknown }) => {
    if (value === undefined || value === null) return value;
    return Array.isArray(value) ? value : ([value] as unknown[]);
  });

  const transformOption = applyDecorators(
    transformToArray,
    Type(() => options.type),
  );

  const optionalOption = Optional(optional);

  return applyDecorators(
    swaggerMainOption,
    transformOption,
    validatorMainOption,
    optionalOption,
  );
}

export function EmailProperty(
  options: DecoratorOption = {},
): PropertyDecorator {
  const { nullable = false, optional = false } = options;

  const swaggerMainOption = applyDecorators(
    ApiProperty({
      name: options.name,
      nullable: nullable,
      description: options.description,
      type: String,
      example: options.example,
    }),
  );

  const validatorMainOption = applyDecorators(
    IsEmail(
      {},
      {
        message: options.message,
      },
    ),
  );

  const optionalOption = Optional(optional);

  return applyDecorators(
    ...(options.transform ? [Type(() => String)] : []),
    swaggerMainOption,
    validatorMainOption,
    optionalOption,
  );
}

export function NestedProperty(
  options: SpecificTypeDecoratorOption,
): PropertyDecorator {
  const { nullable = false, optional = false } = options;

  const swaggerMainOption = applyDecorators(
    ApiProperty({
      name: options.name,
      nullable: nullable,
      type: () => options.type,
      description: options.description,
      example: options.example,
    }),
  );
  const validatorMainOption = applyDecorators(
    ValidateNested({
      message: options.message,
    }),
  );
  const transformOption = applyDecorators(Type(() => options.type));
  const optionalOption = Optional(optional);

  return applyDecorators(
    swaggerMainOption,
    validatorMainOption,
    optionalOption,
    transformOption,
  );
}

/**
 * "HH:mm" format 검증
 */
export function TimeStringProperty(
  options: DecoratorOption = {},
): PropertyDecorator {
  const { nullable = false, optional = false } = options;

  const swaggerMainOption = applyDecorators(
    ApiProperty({
      name: options.name,
      nullable: nullable,
      type: String,
      description: options.description,
      example: options.example,
    }),
  );

  const validatorMainOption = applyDecorators(
    IsString({
      message: options.message ?? '문자열이 아닙니다',
    }),
    Length(5, 5, {
      message: options.message ?? '시간은 HH:mm 형식이어야 합니다',
    }),
  );

  const optionalOption = Optional(optional);

  return applyDecorators(
    swaggerMainOption,
    validatorMainOption,
    optionalOption,
  );
}

/**
 * Validates a string in the format "YYYY-MM-DD"
 */
export function DateStringProperty(
  options: DecoratorOption = {},
): PropertyDecorator {
  const { nullable = false, optional = false } = options;

  const swaggerMainOption = applyDecorators(
    ApiProperty({
      name: options.name,
      nullable,
      type: String,
      description: options.description,
      example: options.example ?? '2025-07-24',
    }),
  );

  const validatorMainOption = applyDecorators(
    IsString({
      message: options.message ?? '문자열이 아닙니다',
    }),
    // YYYY-MM-DD 엄격한 정규식 (윤년 체크 안함)
    Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
      message: options.message ?? '날짜는 YYYY-MM-DD 형식이어야 합니다',
    }),
  );

  const optionalOption = Optional(optional);

  return applyDecorators(
    swaggerMainOption,
    validatorMainOption,
    optionalOption,
  );
}
