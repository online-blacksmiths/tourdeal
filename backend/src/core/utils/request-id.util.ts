import { webcrypto } from 'node:crypto';

export function makeRequestId(length: number = 12): string {
  const timestampPart = Date.now().toString(36);
  const randomValue = new Uint8Array(length);

  webcrypto.getRandomValues(randomValue);

  const randomPart = Array.from(randomValue)
    .map((byte) => byte.toString(36))
    .join('')
    .slice(0, length);

  return `${timestampPart}-${randomPart}`;
}
