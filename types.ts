import React from 'react';
import { translations } from './constants';

export type Screen = 'themeSelector' | 'game' | 'report' | 'collection' | 'shop' | 'logbook' | 'asteroid';
export type GameType = 'count-generator' | 'tap-generator' | 'blow-generator' | 'popper' | 'drawing' | 'fluid' | 'discovery' | 'generative';
export type Language = 'zh' | 'en';
export type TranslationKey = keyof typeof translations.zh;
export type ShopCategory = 'game' | 'skin' | 'theme' | 'decoration';
export type AdPlacement = 'extra_plays' | 'extra_wishes' | 'coin_reward';
export type DecorationInventory = Record<string, number>;


// A unified type for all items that can be displayed, played, or purchased.
export interface ShopItem {
  id: string;
  // FIX: Broaden the icon type to accept SVG props like `style`, resolving type errors in MyAsteroidScreen.
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  category: ShopCategory;
  cost: number;
  // Game-specific properties (optional)
  color?: string;
  bgColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  audioSrc?: string;
  gameType?: GameType;
  // For skins, which game they belong to
  gameId?: string;
  // For decorations, their unique animation style
  animationStyle?: 'swim' | 'pulse' | 'shimmer' | 'sway' | 'spin';
}


// A stricter type for playable games.
export type GameTheme = ShopItem & Required<Pick<ShopItem, 
  'id' | 'icon' | 'color' | 'bgColor' | 
  'gradientFrom' | 'gradientTo' | 'audioSrc' | 'gameType'
>>;


export interface GameState {
  themeId: string;
  clicks: number;
  duration: number; // in seconds
  date: string; // YYYY-MM-DD
  isWishFulfilled: boolean;
}

export interface GameStats {
    totalClicks: number;
    totalDuration: number;
    sessionsPlayed: number;
    clicksPerTheme: Record<string, number>;
    sessionsPerTheme: Record<string, number>;
    daysPlayed: number;
    wishesSent: number;
    wishesReceived: number;
}

export interface Settings {
    language: Language;
    music: boolean;
    sfx: boolean;
    activeTheme: string; // id of the active theme, e.g., 'default' or 'aurora-dream'
    activeSkins: Record<string, string>; // e.g., { sheep: 'dream-sheep', 'wooden-fish': 'crystal-fish' }
    hasDecoratedBefore?: boolean;
    decorationInventory: DecorationInventory;
}

export interface PlacedDecoration {
    itemId: string;
    slotId: number; // 0-7 for the 8 slots
}

export interface DailyStats {
    date: string;
    plays: number;
    wishesSent: number;
    adsWatched: {
        [key in AdPlacement]: number;
    }
}

export interface AnimatingObject {
    id: number;
    x: number;
    y: number;
    vx: number;
    rotation: number;
    scale: number;
    opacity: number;
    icon?: React.FC<{ className?: string }>;
}

export interface SoundWave {
    id: number;
}

export interface BlessingText {
    id: number;
    text: string;
    x: number;
    y: number;
}

export interface Bubble {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    opacity: number;
    type: 'normal' | 'splitter' | 'heart';
}

export interface Sticker {
    id: string;
    icon: React.FC<{ className?: string }>;
    name: (t: (key: TranslationKey) => string) => string;
    getUnlockDescription: (t: (key: TranslationKey) => string) => string;
    isUnlocked: (stats: GameStats, history: GameState[]) => boolean;
}

export interface DriftingStar {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: string;
}

export interface SentWish {
    id: string;
    text: string;
    timestamp: number;
    status: 'traveling' | 'returned';
    echo?: string;
}

export interface ReceivedWish {
    id: string;
    text: string;
    timestamp: number;
}

export interface User {
    id: string;
    name: string;
    isGuest: boolean;
    avatar?: string; // Optional URL for user avatar
}