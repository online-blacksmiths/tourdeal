import { webcrypto } from 'crypto';

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

export const extractRequestId = (req: Request): string => {
  const requestId = req.headers['x-request-id'];

  if (Array.isArray(requestId)) {
    const firstId = requestId[0];
    if (firstId && firstId.trim()) {
      return firstId;
    }
  }

  if (typeof requestId === 'string' && requestId.trim()) {
    return requestId;
  }

  return makeRequestId();
};
