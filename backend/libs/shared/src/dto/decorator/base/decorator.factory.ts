import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, ValidationOptions } from 'class-validator';

import { ERROR_MESSAGES } from '../constants';
import { BaseDecoratorOptions } from './decorator.types';

export class DecoratorFactory {
  static createPropertyDecorator(
    swaggerType: any,
    decorators: PropertyDecorator[],
    options: BaseDecoratorOptions = {},
  ): PropertyDecorator {
    const {
      optional = false,
      nullable = false,
      errorKey,
      description,
      example,
      deprecated,
    } = options;

    const allDecorators: PropertyDecorator[] = [];

    // INFO: Swagger config
    const SwaggerDecorator = optional ? ApiPropertyOptional : ApiProperty;
    allDecorators.push(
      SwaggerDecorator({
        type: swaggerType,
        nullable,
        description: description ?? this.getDescription(errorKey),
        example,
        deprecated,
      }),
    );

    allDecorators.push(...decorators);

    if (optional) {
      allDecorators.push(IsOptional());
    }

    return applyDecorators(...allDecorators);
  }

  private static getDescription(errorKey?: string): string | undefined {
    if (!errorKey) return undefined;
    return ERROR_MESSAGES[errorKey]?.description;
  }

  // INFO: Create validation options with custom error message
  static createValidationOptions(
    errorKey?: string,
    options: ValidationOptions = {},
  ): ValidationOptions {
    return {
      ...options,
      message:
        errorKey && ERROR_MESSAGES[errorKey]
          ? ERROR_MESSAGES[errorKey]?.message
          : options.message,
    };
  }
}
