import { isMockEnabled, withTimeout } from './runtimeMode';

export interface AuthUserData {
  id: string;
  name: string;
  avatar?: string;
  source: 'native' | 'mock';
}

let inFlight = false;

export async function handleLoginRequest(): Promise<AuthUserData | null> {
  if (inFlight) return null;
  inFlight = true;
  try {
    // Explicit Mock selects an isolated test session, even if a native bridge exists.
    if (isMockEnabled()) {
      return { id: 'mock_user_development', name: '测试用户', avatar: '', source: 'mock' };
    }
    const bridge = typeof window !== 'undefined' ? window.harmonyBridge : undefined;
    if (typeof bridge?.login !== 'function') return null;
    const raw = await withTimeout(() => bridge.login(), 60_000);
    const data: unknown = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!data || typeof data !== 'object') return null;
    const user = data as Record<string, unknown>;
    if (typeof user.id !== 'string' || user.id.trim().length === 0
      || user.id.startsWith('mock_') || user.isMock === true
      || (user.source !== undefined && user.source !== 'native')
      || (user.name !== undefined && typeof user.name !== 'string')
      || (user.avatar !== undefined && typeof user.avatar !== 'string')) return null;
    return { id: user.id, name: typeof user.name === 'string' ? user.name : '用户',
      avatar: typeof user.avatar === 'string' ? user.avatar : undefined, source: 'native' };
  } catch {
    return null;
  } finally {
    inFlight = false;
  }
}
