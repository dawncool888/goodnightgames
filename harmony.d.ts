/// <reference types="vite/client" />
import type { AdPlacement, AdReward } from './types';

declare global {
  // This is a NEW required contract, not evidence of an implemented native SDK.
  interface HarmonyRewardedAdReceipt {
    success: boolean;
    rewarded: boolean;
    verified: boolean;
    source: 'native';
    event: 'reward_earned';
    requestId: string;
    placementId: AdPlacement;
    adUnitId: string;
    transactionId: string;
    reward: AdReward;
  }
  interface Window {
    harmonyBridge?: {
      adProtocolVersion?: 2;
      login: () => Promise<unknown>;
      showRewardedAd: (placementId: AdPlacement, requestId: string) => Promise<unknown>;
    };
  }
}
