import type { AdPlacement } from './types';

declare global {
  interface Window {
    harmonyBridge?: {
      login: () => Promise<string | any>; // Returns user data JSON string or object
      showRewardedAd: (placementId: AdPlacement) => Promise<string | any>; // Returns AdResult JSON string or object
    };
  }
}
