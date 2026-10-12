// Vite's build-time constants are the only switch; browser globals cannot enable Mock.
export function isMockEnabled(): boolean {
  return import.meta.env.DEV === true
    && import.meta.env.PROD === false
    && import.meta.env.VITE_ENABLE_MOCKS === 'true';
}

export function runtimeStorageKey(key: string): string {
  return isMockEnabled() ? `goodnightgames.mock.${key}` : key;
}

export async function withTimeout<T>(operation: () => Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  try {
    return await Promise.race([
      Promise.resolve().then(operation),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer!);
  }
}
