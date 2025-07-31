export function toBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;

  if (typeof value === 'string') {
    const lower = value.trim().toLowerCase();

    if (['true', '1', 'yes', 'on'].includes(lower)) {
      return true;
    }

    if (['false', '0', 'no', 'off'].includes(lower)) {
      return false;
    }

    return Boolean(value);
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (value === null || value === undefined) {
    return false;
  }

  return Boolean(value);
}

export function toString(value: any): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';

  return String(value);
}

export function toNumber(value: any): number {
  if (typeof value === 'number') return value;
  const parsed = Number(value);

  if (isNaN(parsed)) {
    throw new Error(`Cannot convert value to number: ${value}`);
  }

  return parsed;
}

export function toDate(value: any): Date {
  if (value instanceof Date) return value;
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    throw new Error(`Cannot convert value to Date: ${value}`);
  }

  return date;
}

export function trim(value: string): string {
  return value?.trim() ?? '';
}

export function normalizePhoneNumber(value: string): string {
  // 숫자와 기호만 남기고 모두 제거
  return value.replace(/[^0-9+]/g, '').trim();
}
