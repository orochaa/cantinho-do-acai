export interface VersionedStorage<T> {
  load: () => T | undefined;
  save: (value: T) => void;
  clear: () => void;
}

export function createVersionedLocalStorage<T>(input: {
  key: string;
  version: number;
  isValid: (value: unknown) => value is T;
}): VersionedStorage<T> {
  const clear = (): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.removeItem(input.key);
    } catch {
      /* unavailable persistence */
    }
  };

  return {
    load: () => {
      if (typeof window === 'undefined') {
        return;
      }
      try {
        const raw = window.localStorage.getItem(input.key);
        if (!raw) {
          return;
        }
        const parsed: unknown = JSON.parse(raw);
        if (
          typeof parsed !== 'object' ||
          parsed === null ||
          (parsed as { version?: unknown }).version !== input.version ||
          !input.isValid((parsed as { value?: unknown }).value)
        ) {
          clear();
          return;
        }
        return (parsed as { value: T }).value;
      } catch {
        clear();
      }
    },
    save: value => {
      if (typeof window === 'undefined') {
        return;
      }
      try {
        window.localStorage.setItem(
          input.key,
          JSON.stringify({ version: input.version, value }),
        );
      } catch {
        /* unavailable or full; in-memory state remains usable */
      }
    },
    clear,
  };
}
