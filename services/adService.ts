// services/adService.ts
import { AdPlacement, AdResult, AdReward } from '../types';


/**
 * 检查指定类型的广告位是否还可以展示广告。
 * 
 * [待办] 您需要在此处实现具体的逻辑。
 * 1. 这个函数已经被App.tsx中的状态管理所替代，但为您保留结构以备未来对接后端。
 * 
 * @param placementId 广告位ID ('extra_plays', 'extra_wishes', 'coin_reward')
 * @returns Promise<boolean> - 返回一个Promise，解析为布尔值，表示是否可以展示广告。
 */
export async function canShowAd(placementId: AdPlacement): Promise<boolean> {
    console.log(`检查广告位 '${placementId}' 是否可展示...`);
    // 当前为模拟逻辑，默认总是可以展示
    return Promise.resolve(true);
}

/**
 * 根据广告位ID，向用户展示一个激励视频广告。
 * 
 * [待办] 您需要在此处实现与您选择的广告SDK的对接逻辑。
 * 
 * @param placementId 广告位ID
 * @returns Promise<AdResult> - 返回一个Promise，解析为一个包含播放结果和奖励信息的对象。
 */
export async function showRewardedAd(placementId: AdPlacement): Promise<AdResult> {
  console.log(`📢 尝试展示原生广告: '${placementId}'...`);
  
  try {
    // ✅ 优先调用原生bridge - 删除所有网络检测！
    if (window.harmonyBridge && typeof window.harmonyBridge.showRewardedAd === 'function') {
      console.log("✅ 检测到 harmonyBridge，调用原生广告");
      
      const result = await window.harmonyBridge.showRewardedAd(placementId);
      const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
      
      if (parsedResult && parsedResult.success && parsedResult.rewarded && parsedResult.reward) {
        console.log("✅ 广告观看成功，获得奖励:", parsedResult);
        return {
          success: true,
          reward: {
            type: parsedResult.reward.type || parsedResult.rewardType || 'coins',
            amount: parsedResult.reward.amount || parsedResult.rewardAmount || 0
          }
        };
      } else {
        console.warn("⚠️ 广告观看失败或未完成:", parsedResult?.error || '未知错误');
        return { success: false, error: parsedResult?.error || '广告展示失败' };
      }
    } else {
      // ⚠️ 降级：bridge不可用时使用mock
      console.warn("⚠️ HarmonyOS bridge 不可用，使用模拟广告");
      return new Promise((resolve) => {
        setTimeout(() => {
          const rewardMap: Record<string, AdReward> = {
            'coin_reward': { type: 'coins', amount: 35 },
            'extra_plays': { type: 'plays', amount: 3 },
            'extra_wishes': { type: 'wishes', amount: 1 }
          };
          const reward = rewardMap[placementId] || rewardMap['coin_reward'];
          console.log("📢 广告播放成功! (模拟)");
          resolve({ success: true, reward: reward });
        }, 1000);
      });
    }
  } catch (error) {
    console.error("❌ HarmonyOS 广告异常:", error);
    return { success: false, error: error instanceof Error ? error.message : '广告展示失败' };
  }
}