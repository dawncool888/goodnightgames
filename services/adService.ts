import type { AdPlacement, AdResult, AdReward } from '../types';
import { isMockEnabled, withTimeout } from './runtimeMode';

// Fixed game rewards; these are not ad revenue or provider payout values.
const REWARDS: Record<AdPlacement, Readonly<AdReward>> = {
  extra_plays: { type: 'plays', amount: 3 },
  extra_wishes: { type: 'wishes', amount: 1 },
  coin_reward: { type: 'coins', amount: 35 },
};
const AD_UNIT_IDS: Record<AdPlacement, string> = {
  extra_plays: 'p7shgce3rk',
  extra_wishes: 'p7jgsr8cj8',
  coin_reward: 'f8jmrtrxqv',
};
const LEDGER_KEY = 'goodnightgames.claimed-ad-transactions.v2';
const AD_TIMEOUT_MS = 120_000;
let inFlight = false;
const issuedRewards = new WeakSet<object>();

function isPlacement(value: unknown): value is AdPlacement {
  return typeof value === 'string' && Object.hasOwn(REWARDS, value);
}

function nativeBridge() {
  if (typeof window === 'undefined') return undefined;
  const bridge = window.harmonyBridge;
  return bridge?.adProtocolVersion === 2 && typeof bridge.showRewardedAd === 'function'
    ? bridge : undefined;
}

function validId(value: unknown): value is string {
  return typeof value === 'string' && value.trim() === value
    && value.length > 0 && value.length <= 256 && !value.startsWith('mock:');
}

// Read and persist before returning success. Corrupt/unavailable storage fails closed.
// Do not evict IDs: eviction would allow old callbacks to be replayed after a reload.
function claimTransaction(transactionId: string): boolean {
  const storage = window.localStorage;
  const raw = storage.getItem(LEDGER_KEY);
  const ids: unknown = raw === null ? [] : JSON.parse(raw);
  if (!Array.isArray(ids) || !ids.every(validId)) throw new Error('INVALID_LEDGER');
  if (ids.includes(transactionId)) return false;
  storage.setItem(LEDGER_KEY, JSON.stringify([...ids, transactionId]));
  return true;
}

/** Capability check only; inventory, consent and SDK errors still fail at show time. */
export async function canShowAd(placementId: AdPlacement): Promise<boolean> {
  return isPlacement(placementId) && !inFlight && (isMockEnabled() || Boolean(nativeBridge()));
}

/** Native v2 must resolve only from its validated SDK reward-earned callback. */
export async function showRewardedAd(placementId: AdPlacement): Promise<AdResult> {
  if (!isPlacement(placementId)) return { success: false, error: 'INVALID_PLACEMENT' };
  if (inFlight) return { success: false, error: 'AD_IN_PROGRESS' };
  inFlight = true;
  try {
    const requestId = globalThis.crypto.randomUUID();
    const expected = REWARDS[placementId];
    let result: AdResult;
    if (isMockEnabled()) {
      result = {
        success: true, source: 'mock', requestId, transactionId: `mock:${requestId}`,
        placementId, reward: { ...expected },
      };
    } else {
      const bridge = nativeBridge();
      if (!bridge) return { success: false, error: 'BRIDGE_UNAVAILABLE' };
      const raw = await withTimeout(() => bridge.showRewardedAd(placementId, requestId), AD_TIMEOUT_MS);
      const response: unknown = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!response || typeof response !== 'object') return { success: false, error: 'INVALID_CALLBACK' };
      const receipt = response as Partial<HarmonyRewardedAdReceipt>;
      if (receipt.success !== true || receipt.rewarded !== true || receipt.verified !== true
        || receipt.source !== 'native' || receipt.event !== 'reward_earned'
        || receipt.requestId !== requestId || receipt.placementId !== placementId
        || receipt.adUnitId !== AD_UNIT_IDS[placementId] || !validId(receipt.transactionId)
        || receipt.reward?.type !== expected.type || receipt.reward.amount !== expected.amount) {
        return { success: false, error: 'INVALID_CALLBACK' };
      }
      if (!claimTransaction(receipt.transactionId)) return { success: false, error: 'DUPLICATE_REWARD' };
      result = {
        success: true, source: 'native', requestId, transactionId: receipt.transactionId,
        placementId, reward: { ...expected },
      };
    }
    Object.freeze(result.reward);
    Object.freeze(result);
    issuedRewards.add(result);
    return result;
  } catch (error) {
    return { success: false, error: error instanceof Error && error.message === 'TIMEOUT'
      ? 'AD_TIMEOUT' : 'AD_FAILED' };
  } finally {
    inFlight = false;
  }
}

/** The UI must consume before applying state updates; each issued result is usable once. */
export function consumeAdReward(result: AdResult): boolean {
  if (!result.success || !issuedRewards.has(result)) return false;
  issuedRewards.delete(result);
  return result.source === 'native' || (result.source === 'mock' && isMockEnabled());
}
