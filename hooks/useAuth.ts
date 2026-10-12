import { useRef, useState } from 'react';
import type { User } from '../types';
import { handleLoginRequest } from '../services/authService';
import { runtimeStorageKey } from '../services/runtimeMode';

const GUEST_USER: User = { id: 'guest', name: 'Guest', isGuest: true };

// A cached browser profile is not proof of login. Each page load starts as Guest.
export function useAuth(onFirstLogin?: () => void) {
  const [user, setUser] = useState<User>(GUEST_USER);
  const [loginFailed, setLoginFailed] = useState(false);
  const busy = useRef(false);

  const login = async () => {
    if (busy.current) return;
    busy.current = true;
    setLoginFailed(false);
    try {
      const data = await handleLoginRequest();
      if (!data) { setLoginFailed(true); return; }
      setUser({ id: data.id, name: data.name, avatar: data.avatar, isGuest: false });
      const bonusKey = runtimeStorageKey(`goodnightgames.loginBonus.${data.id}`);
      // Record before awarding: failures favor at-most-once over duplicating a bonus.
      if (localStorage.getItem(bonusKey) !== 'claimed') {
        localStorage.setItem(bonusKey, 'claimed');
        onFirstLogin?.();
      }
    } catch {
      setLoginFailed(true);
    } finally {
      busy.current = false;
    }
  };
  return { user, login, loginFailed };
}
