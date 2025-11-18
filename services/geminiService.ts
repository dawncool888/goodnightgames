import type { GameTheme, Language, TranslationKey } from '../types';
import { ALL_REPORTS, PRE_WRITTEN_ECHOS, CONSTELLATION_WORDS, translations } from '../constants';

// 此函数从本地预设的报告库生成报告，确保了核心的AI日记功能可以完全离线使用。
export function generateFunReport(session: { theme: GameTheme, clicks: number, duration: number }, language: Language): Promise<string> {
  const { theme, clicks } = session;

  const fallbackMessage = language === 'en' 
    ? "The night sky shone brighter because of you. May you have sweet dreams tonight."
    : "昨夜的星空因你而闪亮，愿你今晚也有个甜甜的梦。";

  try {
    // 根据语言和主题选择对应的报告集合
    const reportsForLanguage = ALL_REPORTS[language];
    const reportsForTheme = reportsForLanguage[theme.id as keyof typeof reportsForLanguage];

    if (!reportsForTheme || reportsForTheme.length === 0) {
      return Promise.resolve(fallbackMessage);
    }
    
    // 从列表中随机选择一条报告
    const randomIndex = Math.floor(Math.random() * reportsForTheme.length);
    let report = reportsForTheme[randomIndex];

    // 将占位符替换为实际数据
    report = report.replace(/\{clicks\}/g, String(clicks));

    return Promise.resolve(report);

  } catch (error) {
    // FIX: Added braces to the catch block to fix syntax error.
    console.error("生成本地报告时出错:", error);
    return Promise.resolve(fallbackMessage);
  }
}


// --- 已本地化的 "星辰回响" 功能 ---

/**
 * 从本地预设的回复库中为用户的“心愿”生成一个“回响”。
 * 这个函数现在是完全离线的，不进行任何网络调用。
 * @param wishText - 用户发送的心愿文本 (当前未使用，为未来扩展保留)。
 * @param language - 当前的应用语言设置。
 * @returns 一个包含诗意回复的Promise<string>。
 */
export async function generateEchoForWish(wishText: string, language: Language): Promise<string> {
    try {
        const echos = PRE_WRITTEN_ECHOS[language];
        const randomIndex = Math.floor(Math.random() * echos.length);
        // 模拟一个短暂的延迟，让体验更真实
        await new Promise(resolve => setTimeout(resolve, 750));
        return echos[randomIndex];
    } catch (error) {
        console.error("生成本地回响时出错:", error);
        return language === 'en'
            ? "Your wish traveled far, know that it was heard."
            : "你的愿望已远行，请知悉，它已被聆听。";
    }
}


// --- NEW: Offline Constellation Naming ---

interface ConstellationDescription {
    starCount: number;
    lineCount: number;
    isClosed: boolean;
    aspectRatio: number; // width / height of bounding box
    pathAreaRatio: number; // path bounding box area / canvas area
}

interface ConstellationName {
    name: string;
    description: string;
}

/**
 * Generates a name and story for a user-drawn constellation using local data.
 * This function is completely offline.
 * @param constellation - An object describing the abstract properties of the drawing.
 * @param language - The desired language for the response ('zh' or 'en').
 * @returns A Promise resolving to an object with 'name' and 'description'.
 */
export async function nameConstellation(
    constellation: ConstellationDescription,
    language: Language
): Promise<ConstellationName> {
     const fallbackResponse = language === 'zh'
        ? { name: '遗忘的诗篇', description: '一颗星星记得一个被遗忘的故事。' }
        : { name: 'The Forgotten Verse', description: 'A star that remembers a forgotten story.' };

    try {
        const words = CONSTELLATION_WORDS[language];
        const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
        
        const adjective = getRandom(words.adjectives);
        let noun: string;

        // Determine noun type based on constellation properties
        if (constellation.starCount > 7 && constellation.pathAreaRatio < 0.1) {
            noun = getRandom(words.nounsCluster);
        } else if (constellation.isClosed) {
            noun = getRandom(words.nounsClosed);
        } else {
            noun = getRandom(words.nounsOpen);
        }

        const name = language === 'en' ? `${adjective} ${noun}` : `${adjective}${noun}`;
        
        const t = (key: TranslationKey) => translations[language][key] || key;
        const description = t('desc-constellation');

        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        return { name, description };

    } catch (error) {
        console.error("Failed to name constellation locally:", error);
        return fallbackResponse;
    }
}
