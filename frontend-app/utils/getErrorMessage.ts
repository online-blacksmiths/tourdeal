type MessageKey = "message" | "errorMessage" | "error" | string;

interface GetNestedMessageOptions {
  messageKey?: MessageKey;
  stopOnFirst?: boolean;
  separator?: string;
}

export function getErrorMessage(
  obj: Record<string, any>,
  options: GetNestedMessageOptions = {},
): string | undefined {
  const {
    messageKey = "message",
    stopOnFirst = true,
    separator = ",",
  } = options;

  const message: string[] = [];
  const messageKeys = Array.isArray(messageKey) ? messageKey : [messageKey];

  const extract = (value: any): void => {
    if (Array.isArray(value)) {
      value.forEach((item) => extract(item));
    } else if (typeof value === "object" && value !== null) {
      for (const key of messageKeys) {
        if (key in value) {
          message.push(String(value[key]));
          if (stopOnFirst) return;
        }
      }

      Object.values(value).forEach((v) => extract(v));
    }
  };

  extract(obj);

  return message.length > 0
    ? stopOnFirst
      ? message[0]
      : message.join(separator)
    : undefined;
}
