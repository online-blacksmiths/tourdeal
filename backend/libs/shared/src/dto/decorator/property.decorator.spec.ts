import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import {
  ArrayProperty,
  BooleanProperty,
  DateProperty,
  EmailProperty,
  EnumProperty,
  GenericProperty,
  NestedProperty,
  NumberProperty,
  StringProperty,
  UuidProperty,
} from './property.decorator';

// Helper function to perform transformation and validation
async function validateAndTransform<T extends object>(
  dtoClass: new () => T,
  plainObject: any,
) {
  const instance = plainToInstance(dtoClass, plainObject);
  const errors = await validate(instance);
  return { instance, errors };
}

describe('Property Decorators', () => {
  describe('StringProperty', () => {
    class TestStringDto {
      @StringProperty()
      name: string;

      @StringProperty({ minLength: 3, maxLength: 5 })
      code: string;

      @StringProperty({ pattern: /^\d{3}-\d{4}$/ })
      phone: string;

      @StringProperty({ trim: true, lowercase: true })
      tag: string;

      @StringProperty({ optional: true })
      optional?: string;

      @StringProperty({ transform: (value) => `transformed:${value}` })
      customTransform: string;
    }

    it('should validate a valid string', async () => {
      const { errors } = await validateAndTransform(TestStringDto, {
        name: 'test',
        code: 'abc',
        phone: '123-4567',
        tag: '  TAG  ',
        customTransform: 'value',
      });
      expect(errors.length).toBe(0);
    });

    it('should invalidate a non-string value', async () => {
      const { errors } = await validateAndTransform(TestStringDto, {
        name: 123,
        code: 'abc',
        phone: '123-4567',
        tag: 'tag',
        customTransform: 'value',
      });
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('name');
    });

    it('should validate minLength and maxLength', async () => {
      const { errors: tooShortErrors } = await validateAndTransform(
        TestStringDto,
        {
          name: 'test',
          code: 'ab',
          phone: '123-4567',
          tag: 'tag',
          customTransform: 'value',
        },
      );
      expect(tooShortErrors.length).toBe(1);

      const { errors: tooLongErrors } = await validateAndTransform(
        TestStringDto,
        {
          name: 'test',
          code: 'abcdef',
          phone: '123-4567',
          tag: 'tag',
          customTransform: 'value',
        },
      );
      expect(tooLongErrors.length).toBe(1);
    });

    it('should validate pattern', async () => {
      const { errors } = await validateAndTransform(TestStringDto, {
        name: 'test',
        code: 'abc',
        phone: 'invalid-phone',
        tag: 'tag',
        customTransform: 'value',
      });
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('phone');
    });

    it('should transform string (trim, lowercase)', async () => {
      const { instance } = await validateAndTransform(TestStringDto, {
        name: 'test',
        code: 'abc',
        phone: '123-4567',
        tag: '  MyTag  ',
        customTransform: 'value',
      });
      expect(instance.tag).toBe('mytag');
    });

    it('should apply custom transform function', async () => {
      const { instance } = await validateAndTransform(TestStringDto, {
        name: 'test',
        code: 'abc',
        phone: '123-4567',
        tag: 'tag',
        customTransform: 'value',
      });
      expect(instance.customTransform).toBe('transformed:value');
    });
  });

  describe('NumberProperty', () => {
    class TestNumberDto {
      @NumberProperty()
      age: number;

      @NumberProperty({ min: 0, max: 100, integer: true })
      score: number;

      @NumberProperty({ positive: true })
      positiveValue: number;
    }

    it('should transform and validate a valid number', async () => {
      const { instance, errors } = await validateAndTransform(TestNumberDto, {
        age: '30',
        score: 50,
        positiveValue: 10,
      });
      expect(errors.length).toBe(0);
      expect(instance.age).toBe(30);
    });

    it('should invalidate non-numeric string', async () => {
      const { errors } = await validateAndTransform(TestNumberDto, {
        age: 'not-a-number',
        score: 50,
        positiveValue: 10,
      });
      expect(errors.length).toBe(1);
    });

    it('should validate integer', async () => {
      const { errors } = await validateAndTransform(TestNumberDto, {
        age: 30,
        score: 50.5,
        positiveValue: 10,
      });
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('score');
    });

    it('should validate min and max', async () => {
      const { errors } = await validateAndTransform(TestNumberDto, {
        age: 30,
        score: 101,
        positiveValue: 10,
      });
      expect(errors.length).toBe(1);
    });

    it('should validate positive', async () => {
      const { errors } = await validateAndTransform(TestNumberDto, {
        age: 30,
        score: 50,
        positiveValue: -10,
      });
      expect(errors.length).toBe(1);
    });
  });

  describe('BooleanProperty', () => {
    class TestBooleanDto {
      @BooleanProperty()
      isActive: boolean;

      @BooleanProperty({ nullable: true })
      isNullable?: boolean | null;
    }

    it.each([
      ['true', true],
      ['1', true],
      ['yes', true],
      [true, true],
      ['false', false],
      ['0', false],
      ['no', false],
      [false, false],
    ])('should transform "%s" to %s', async (input, expected) => {
      const { instance, errors } = await validateAndTransform(TestBooleanDto, {
        isActive: input,
        isNullable: undefined, // Explicitly set as undefined
      });
      expect(errors.length).toBe(0);
      expect(instance.isActive).toBe(expected);
    });

    it('should allow null for nullable property', async () => {
      const { instance, errors } = await validateAndTransform(TestBooleanDto, {
        isActive: true,
        isNullable: null,
      });
      expect(errors.length).toBe(0);
      expect(instance.isNullable).toBeNull();
    });
  });

  describe('DateProperty', () => {
    class TestDateDto {
      @DateProperty()
      createdAt: Date;
    }

    it('should transform an ISO string to a Date object', async () => {
      const dateString = new Date().toISOString();
      const { instance, errors } = await validateAndTransform(TestDateDto, {
        createdAt: dateString,
      });
      expect(errors.length).toBe(0);
      expect(instance.createdAt).toBeInstanceOf(Date);
      expect(instance.createdAt.toISOString()).toBe(dateString);
    });

    it('should invalidate an invalid date string', async () => {
      const { errors } = await validateAndTransform(TestDateDto, {
        createdAt: 'invalid-date',
      });
      expect(errors.length).toBe(1);
    });
  });

  describe('EmailProperty', () => {
    class TestEmailDto {
      @EmailProperty()
      email: string;
    }

    it('should validate a valid email and transform to lowercase', async () => {
      const { instance, errors } = await validateAndTransform(TestEmailDto, {
        email: '  Test@Example.COM  ',
      });
      expect(errors.length).toBe(0);
      expect(instance.email).toBe('test@example.com');
    });

    it('should invalidate an invalid email', async () => {
      const { errors } = await validateAndTransform(TestEmailDto, {
        email: 'not-an-email',
      });
      expect(errors.length).toBe(1);
    });
  });

  describe('EnumProperty', () => {
    enum UserRole {
      ADMIN = 'ADMIN',
      USER = 'USER',
    }

    class TestEnumDto {
      @EnumProperty(UserRole)
      role: UserRole;
    }

    it('should validate a valid enum value', async () => {
      const { errors } = await validateAndTransform(TestEnumDto, {
        role: 'ADMIN',
      });
      expect(errors.length).toBe(0);
    });

    it('should invalidate an invalid enum value', async () => {
      const { errors } = await validateAndTransform(TestEnumDto, {
        role: 'GUEST',
      });
      expect(errors.length).toBe(1);
    });
  });

  describe('UuidProperty', () => {
    class TestUuidDto {
      @UuidProperty()
      id: string;
    }

    it('should validate a valid UUID', async () => {
      const { errors } = await validateAndTransform(TestUuidDto, {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      });
      expect(errors.length).toBe(0);
    });

    it('should invalidate an invalid UUID', async () => {
      const { errors } = await validateAndTransform(TestUuidDto, {
        id: 'not-a-uuid',
      });
      expect(errors.length).toBe(1);
    });
  });

  describe('NestedProperty', () => {
    class NestedDto {
      @StringProperty()
      field: string;
    }

    class TestNestedDto {
      @NestedProperty(() => NestedDto)
      nested: NestedDto;
    }

    it('should validate a valid nested object', async () => {
      const { errors } = await validateAndTransform(TestNestedDto, {
        nested: { field: 'value' },
      });
      expect(errors.length).toBe(0);
    });

    it('should invalidate an invalid nested object', async () => {
      const { errors } = await validateAndTransform(TestNestedDto, {
        nested: { field: 123 },
      });
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('nested');
      expect(errors[0].children).toBeDefined();
      expect(errors[0].children?.[0]?.constraints).toHaveProperty('isString');
    });
  });

  describe('ArrayProperty', () => {
    class NestedDto {
      @StringProperty()
      field: string;
    }

    class TestArrayDto {
      @ArrayProperty({ type: () => String, minSize: 1, maxSize: 2 })
      tags: string[];

      @ArrayProperty({ type: () => NestedDto, unique: true })
      nestedItems: NestedDto[];
    }

    it('should validate a valid array of primitives', async () => {
      const { errors } = await validateAndTransform(TestArrayDto, {
        tags: ['tag1'],
        nestedItems: [{ field: 'a' }],
      });
      expect(errors.length).toBe(0);
    });

    it('should invalidate array size', async () => {
      const { errors } = await validateAndTransform(TestArrayDto, {
        tags: [],
        nestedItems: [{ field: 'a' }],
      });
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('tags');
    });

    it('should validate a nested array', async () => {
      const { errors } = await validateAndTransform(TestArrayDto, {
        tags: ['tag1'],
        nestedItems: [{ field: 'a' }, { field: 123 }],
      });
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('nestedItems');
    });
  });

  describe('GenericProperty', () => {
    class TestGenericDto {
      @GenericProperty()
      payload: any;

      @GenericProperty({ isArray: true, type: () => String })
      items: string[];
    }

    it('should handle any object', async () => {
      const { instance, errors } = await validateAndTransform(TestGenericDto, {
        payload: { key: 'value', num: 123 },
        items: ['a', 'b'],
      });
      expect(errors.length).toBe(0);
      expect(instance.payload).toEqual({ key: 'value', num: 123 });
    });

    it('should validate array type', async () => {
      const { errors } = await validateAndTransform(TestGenericDto, {
        payload: {},
        items: ['a', 123],
      });
      // Note: IsString({ each: true }) is applied
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('items');
    });
  });
});
