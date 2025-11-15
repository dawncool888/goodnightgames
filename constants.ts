import { useCallback } from 'react';
import {
    SheepIcon, DreamSheepIcon, WoodenFishIcon, CrystalFishIcon, DandelionIcon, BellflowerIcon,
    BubbleIcon, MorningDewIcon, ConstellationGameIcon, MoonRiverGameIcon, CloudSeaGameIcon, SecretGardenGameIcon,
    AuroraIcon, ForestIcon, DeepSeaIcon,
    GlowingTreeIcon, CrystalTowerIcon, SleepingFoxIcon, DreamWhaleIcon, StarflowerIcon, RainbowGeyserIcon,
    JellyAuroraIcon, GlimmerSpritesIcon, StardustWaterfallIcon, WhisperingChimeIcon, LuminousJellyTentIcon,
    MilkyWayPathIcon, FloatingCrystalIcon, CloudSheepIcon, BubbleLampIcon, CosmicJellyfishIcon,
    StarIcon, MoonIcon, CloudIcon, HeartIcon, MusicIcon, CatIcon, LeafIcon, SunIcon, PlanetIcon,
    FeatherIcon, KeyIcon, LanternIcon, PaperPlaneIcon, OrigamiBirdIcon, BookIcon, TeaCupIcon,
    GlowingDeerIcon, StarlightFishIcon, RainbowCloudIcon
} from './components/icons/ThemeIcons';
import type { Language, ShopItem, Sticker, TranslationKey, GameStats, GameState } from './types';

export const translations = {
    // Chinese translations
    zh: {
        // General UI
        home: '主页',
        collection: '收集',
        asteroid: '小行星',
        shop: '商店',
        report: '日记',
        settings: '设置',
        done: '完成',
        language: '语言',
        backgroundMusic: '背景音乐',
        soundEffects: '音效',
        activeTheme: '当前主题',
        whisperToJelly: '给Jelly留言...',
        
        // Loading Screen
        loadingMessage1: '正在连接星空...',
        loadingMessage2: '正在唤醒Jelly...',
        loadingMessage3: '正在校准星轨...',

        // Theme Selector
        chooseGame: '选择一个小游戏, 陪伴你入睡',
        jellysWishToday: "Jelly今日心愿",
        sendAWishHome: '向星空许个愿',
        unlockGamesPrompt: '在商店中解锁更多游戏!',

        // Game Screen
        end: '结束',
        cloudSeaComplete: '你找到了所有的梦境碎片！',
        newRound: '开始新一局',

        // Report Screen
        diaryTitle: '晚安日记',
        viewMyStarrySkyDiary: '查看我的星空手帐',
        dailyDuration: '每日时长 (近30日)',
        favoriteGames: '最常玩的游戏',
        noDataPrompt: '还没有数据哦, 今晚来玩一下吧!',
        sessionUnitOne: '次',
        sessionsUnitPlural: '次',
        generatingReport: '正在生成今日的星空报告...',
        reportError: '生成报告时似乎迷失在了星云里。不过, 你的努力让星空更亮了。',
        prevDay: '前一天',
        nextDay: '后一天',
        interactionCount: '互动次数',
        durationBeforeSleep: '睡前时长',
        wishFulfilled: '今日心愿已达成: {themeName}',
        wishFulfilledQuote: '"谢谢你, 今晚的星星会更亮一点。"',
        reportLimitMessage: '今日报告基于最后一次游玩 ({count}次)。',

        // Collection Screen
        lockedSticker: '未解锁',

        // Shop
        shopGames: '游戏',
        shopSkins: '皮肤',
        shopThemes: '主题',
        shopDecorations: '装饰',
        wishCoins: '心愿币',
        insufficientCoins: '心愿币不足!',
        owned: '已拥有',
        applied: '已应用',
        equipped: '已装备',
        apply: '应用',
        equip: '装备',
        purchase: '购买',
        getWishCoins: '获取心愿币',
        comingSoon: '更多商品正在穿越星际而来...',
        watchAdForCoins: '观看星光获取心愿币',

        // Message Modal
        messageFromStars: '来自星星的漂流瓶',

        // Wish Sender
        sendAWish: '许下你的心愿',
        writeYourWish: '在这里写下你的愿望, 让它飞向星空... (最多80个字)',
        sendToStars: '送往星空',

        // Logbook
        myStarrySkyDiary: '星空手帐',
        mySentWishes: '我的心愿',
        myReceivedWishes: '收到的回响',
        viewEcho: '查看星辰回响',
        echoFallback: '星星还在轻声回应...',
        receiving: '接收中...',
        callEcho: '呼唤回响',
        travelingInSpace: '在星际中旅行...',
        noWishesSentYet: '你还没有许下心愿。',
        noWishesReceivedYet: '还没有收到来自远方的回响。',

        // Ad Modals
        adPromptTitle: '来自星空的赠礼',
        adPromptPlaysMessage: '今日的游戏次数已用完, 是否观看一段星光来获得额外3次机会?',
        adPromptWishesMessage: '今日的许愿次数已用完, 是否观看一段星光来获得额外1次机会?',
        adPromptCoinsMessage: '想获得更多心愿币吗? 观看一段星光来获得随机奖励吧!',
        adPromptCancel: '不用了',
        adPromptConfirm: '观看星光',
        adLimitTitle: '星光也需要休息',
        adLimitMessage: '今天的星光能量已经用完啦, 请在明天再来吧!',
        adLimitResetTime: '重置倒计时:',
        
        // Login Bonus Modal
        loginBonusTitle: '登录奖励',
        loginBonusMessage: '欢迎回来！作为首次登录的礼物, 你获得了 {amount} 心愿币！',
        loginBonusConfirm: '太棒了',

        // My Asteroid
        myAsteroid: '我的小行星',
        dragToDecorate: '拖动装饰品到小行星上',
        tutorialDragReturn: '点击装饰品可以回收哦',

        // Game Names
        'sheep': '数羊羊',
        'wooden-fish': '敲敲乐',
        'dandelion': '蒲公英',
        'bubble-popper': '戳泡泡',
        'constellation': '星之绘卷',
        'moon-river': '琉璃月河',
        'cloud-sea': '云海寻梦',
        'secret-garden': '时光花园',

        // Skin Names
        'dream-sheep': '梦境羊',
        'crystal-fish': '水晶鱼',
        'bellflower': '风铃草',
        'morning-dew': '晨露',
        
        // Theme Names
        'default': '默认星空',
        'aurora-dream': '极光之梦',
        'serene-forest': '静谧森林',
        'deep-sea': '深海',

        // Decoration Names
        'glowing-tree': '荧光古树',
        'crystal-tower': '水晶塔',
        'sleeping-fox': '眠狐',
        'dream-whale': '梦境之鲸',
        'starflower': '星星花',
        'rainbow-geyser': '彩虹泉',
        'jelly-aurora': '果冻极光',
        'glimmer-sprites': '闪光精灵',
        'stardust-waterfall': '星尘瀑布',
        'whispering-chime': '低语风铃',
        'luminous-jelly-tent': '夜光水母帐',
        'milky-way-path': '银河小径',
        'floating-crystal': '浮空水晶',
        'cloud-sheep': '云朵羊',
        'bubble-lamp': '泡泡灯',
        'cosmic-jellyfish': '宇宙水母',

        // Decoration Descriptions
        'desc-glowing-tree': '在夜里会发出柔和光芒的树。',
        'desc-crystal-tower': '据说能放大星辰的力量。',
        'desc-sleeping-fox': '一只蜷缩着睡觉的小狐狸。',
        'desc-dream-whale': '在梦的海洋里遨游的鲸鱼。',
        'desc-starflower': '花瓣像星星一样闪烁。',
        'desc-rainbow-geyser': '会喷出七彩光芒的间歇泉。',
        'desc-jelly-aurora': '像果冻一样Q弹的极光。',
        'desc-glimmer-sprites': '一群调皮的光点精灵。',
        'desc-stardust-waterfall': '流淌着星尘的瀑布。',
        'desc-whispering-chime': '风吹过时会发出星辰的低语。',
        'desc-luminous-jelly-tent': '一只巨大的发光水母, 像帐篷。',
        'desc-milky-way-path': '通往银河深处的小路。',
        'desc-floating-crystal': '悬浮在空中的神秘水晶。',
        'desc-cloud-sheep': '一团看起来像羊的云。',
        'desc-bubble-lamp': '会吐出彩色泡泡的灯。',
        'desc-cosmic-jellyfish': '在宇宙中漂浮的水母。',

        // Game descriptions
        'desc-sheep': '点击小羊, 帮你入睡。',
        'desc-wooden-fish': '敲敲木鱼, 积累功德。',
        'desc-dandelion': '吹散蒲公英, 放飞思绪。',
        'desc-bubble-popper': '捏破泡泡, 解压放松。',
        'desc-constellation': '连接星星, 创造属于你的星座故事。',
        'desc-moon-river': '轻点月河, 泛起治愈的涟漪。',
        'desc-cloud-sea': '拨开云海, 寻找隐藏的梦境碎片。',
        'desc-secret-garden': '每一次点击, 都绽放一株独一无二的光之花。',

        // Skin descriptions
        'desc-dream-sheep': '一只来自梦境的半透明小羊。',
        'desc-crystal-fish': '由纯净水晶构成的木鱼。',
        'desc-bellflower': '摇曳时会发出清脆声音的花。',
        'desc-morning-dew': '清晨绿叶上的第一滴露珠。',

        // Theme descriptions
        'desc-default': '经典而宁静的夜空。',
        'desc-serene-forest': '被萤火虫和月光环绕的森林。',
        'desc-deep-sea': '潜入深海, 与发光生物共舞。',
    },
    // English translations
    en: {
        // General UI
        home: 'Home',
        collection: 'Collection',
        asteroid: 'Asteroid',
        shop: 'Shop',
        report: 'Diary',
        settings: 'Settings',
        done: 'Done',
        language: 'Language',
        backgroundMusic: 'Music',
        soundEffects: 'SFX',
        activeTheme: 'Active Theme',
        whisperToJelly: 'Whisper to Jelly...',
        
        // Loading Screen
        loadingMessage1: 'Connecting to the stars...',
        loadingMessage2: 'Waking up Jelly...',
        loadingMessage3: 'Calibrating star charts...',

        // Theme Selector
        chooseGame: 'Choose a mini-game to help you sleep',
        jellysWishToday: "Jelly's Wish Today",
        sendAWishHome: 'Make a Wish to the Stars',
        unlockGamesPrompt: 'Unlock more games in the shop!',
        
        // Game Screen
        end: 'End',
        cloudSeaComplete: 'You found all the dream fragments!',
        newRound: 'New Round',

        // Report Screen
        diaryTitle: 'Good Night Diary',
        viewMyStarrySkyDiary: 'View My Starry Sky Logbook',
        dailyDuration: 'Daily Duration (Last 30 days)',
        favoriteGames: 'Favorite Games',
        noDataPrompt: "No data yet. Let's play tonight!",
        sessionUnitOne: 'session',
        sessionsUnitPlural: 'sessions',
        generatingReport: 'Generating today\'s starry sky report...',
        reportError: 'Got lost in a nebula while generating the report. But your effort made the sky brighter.',
        prevDay: 'Prev Day',
        nextDay: 'Next Day',
        interactionCount: 'Interactions',
        durationBeforeSleep: 'Time Before Sleep',
        wishFulfilled: 'Today\'s wish fulfilled: {themeName}',
        wishFulfilledQuote: '"Thank you. The stars will be a little brighter tonight."',
        reportLimitMessage: 'Today\'s report is based on the last session ({count} total).',
        
        // Collection Screen
        lockedSticker: 'Locked',
        
        // Shop
        shopGames: 'Games',
        shopSkins: 'Skins',
        shopThemes: 'Themes',
        shopDecorations: 'Decorations',
        wishCoins: 'Wish Coins',
        insufficientCoins: 'Insufficient Wish Coins!',
        owned: 'Owned',
        applied: 'Applied',
        equipped: 'Equipped',
        apply: 'Apply',
        equip: 'Equip',
        purchase: 'Purchase',
        getWishCoins: 'Get Coins',
        comingSoon: 'More items are traveling through space...',
        watchAdForCoins: 'Watch Starlight for Coins',

        // Message Modal
        messageFromStars: 'A Message in a Bottle',
        
        // Wish Sender
        sendAWish: 'Make Your Wish',
        writeYourWish: 'Write down your wish here and let it fly to the stars... (max 80 chars)',
        sendToStars: 'Send to Stars',
        
        // Logbook
        myStarrySkyDiary: 'Starry Sky Logbook',
        mySentWishes: 'My Wishes',
        myReceivedWishes: 'Echoes',
        viewEcho: 'View Star Echo',
        echoFallback: 'The stars are still whispering...',
        receiving: 'Receiving...',
        callEcho: 'Call for Echo',
        travelingInSpace: 'Traveling in space...',
        noWishesSentYet: "You haven't made a wish yet.",
        noWishesReceivedYet: "No echoes received from afar yet.",
        
        // Ad Modals
        adPromptTitle: 'A Gift from the Stars',
        adPromptPlaysMessage: "You've used up today's plays. Watch a starlight to get 3 extra chances?",
        adPromptWishesMessage: "You've used up today's wishes. Watch a starlight to get 1 extra chance?",
        adPromptCoinsMessage: 'Want more Wish Coins? Watch a starlight for a random reward!',
        adPromptCancel: 'No, thanks',
        adPromptConfirm: 'Watch Starlight',
        adLimitTitle: 'Starlight Needs Rest',
        adLimitMessage: "Today's starlight energy has been depleted. Please come back tomorrow!",
        adLimitResetTime: 'Resets in:',

        // Login Bonus Modal
        loginBonusTitle: 'Login Bonus',
        loginBonusMessage: "Welcome back! As a first-time login gift, you've received {amount} Wish Coins!",
        loginBonusConfirm: 'Awesome!',

        // My Asteroid
        myAsteroid: 'My Asteroid',
        dragToDecorate: 'Drag decorations onto the asteroid',
        tutorialDragReturn: 'Click a decoration to reclaim it',

        // Game Names
        'sheep': 'Count Sheep',
        'wooden-fish': 'Zen Fish',
        'dandelion': 'Dandelion',
        'bubble-popper': 'Bubble Pop',
        'constellation': 'Starry Canvas',
        'moon-river': 'Moonlight River',
        'cloud-sea': 'Cloud Sea Dream',
        'secret-garden': 'Garden of Time',
        
        // Skin Names
        'dream-sheep': 'Dream Sheep',
        'crystal-fish': 'Crystal Fish',
        'bellflower': 'Bellflower',
        'morning-dew': 'Morning Dew',
        
        // Theme Names
        'default': 'Default Sky',
        'aurora-dream': 'Aurora Dream',
        'serene-forest': 'Serene Forest',
        'deep-sea': 'Deep Sea',
        
        // Decoration Names
        'glowing-tree': 'Glowing Tree',
        'crystal-tower': 'Crystal Tower',
        'sleeping-fox': 'Sleeping Fox',
        'dream-whale': 'Dream Whale',
        'starflower': 'Starflower',
        'rainbow-geyser': 'Rainbow Geyser',
        'jelly-aurora': 'Jelly Aurora',
        'glimmer-sprites': 'Glimmer Sprites',
        'stardust-waterfall': 'Stardust Waterfall',
        'whispering-chime': 'Whispering Chime',
        'luminous-jelly-tent': 'Luminous Jelly-Tent',
        'milky-way-path': 'Milky Way Path',
        'floating-crystal': 'Floating Crystal',
        'cloud-sheep': 'Cloud Sheep',
        'bubble-lamp': 'Bubble Lamp',
        'cosmic-jellyfish': 'Cosmic Jellyfish',

        // Decoration Descriptions
        'desc-glowing-tree': 'A tree that emits a soft glow at night.',
        'desc-crystal-tower': 'Said to amplify the power of the stars.',
        'desc-sleeping-fox': 'A little fox curled up and sleeping soundly.',
        'desc-dream-whale': 'A whale that swims in the ocean of dreams.',
        'desc-starflower': 'Its petals shimmer like little stars.',
        'desc-rainbow-geyser': 'A geyser that spouts a rainbow of light.',
        'desc-jelly-aurora': 'An aurora that is as bouncy as jelly.',
        'desc-glimmer-sprites': 'A group of mischievous light sprites.',
        'desc-stardust-waterfall': 'A waterfall with flowing stardust.',
        'desc-whispering-chime': 'Whispers of the stars can be heard when the wind blows.',
        'desc-luminous-jelly-tent': 'A giant, glowing jellyfish that looks like a tent.',
        'desc-milky-way-path': 'A path that leads to the depths of the Milky Way.',
        'desc-floating-crystal': 'A mysterious crystal that floats in the air.',
        'desc-cloud-sheep': 'A cloud that looks just like a sheep.',
        'desc-bubble-lamp': 'A lamp that produces colorful bubbles.',
        'desc-cosmic-jellyfish': 'A jellyfish that drifts through the cosmos.',
        
        // Game descriptions
        'desc-sheep': 'Count the sheep to help you fall asleep.',
        'desc-wooden-fish': 'Tap the wooden fish for good karma.',
        'desc-dandelion': 'Blow the dandelion seeds and free your mind.',
        'desc-bubble-popper': 'Pop bubbles to relax and de-stress.',
        'desc-constellation': 'Connect stars and create your own constellation story.',
        'desc-moon-river': 'Tap the river to create healing ripples.',
        'desc-cloud-sea': 'Part the clouds to find hidden dream fragments.',
        'desc-secret-garden': 'Each tap grows a unique, ephemeral flower of light.',

        // Skin descriptions
        'desc-dream-sheep': 'A translucent sheep from the realm of dreams.',
        'desc-crystal-fish': 'A wooden fish carved from pure crystal.',
        'desc-bellflower': 'A flower that chimes when it sways.',
        'desc-morning-dew': 'The first drop of dew on a morning leaf.',

        // Theme descriptions
        'desc-default': 'The classic, peaceful night sky.',
        'desc-aurora-dream': 'Fall asleep under the magical aurora.',
        'desc-serene-forest': 'A forest filled with fireflies and moonlight.',
        'desc-deep-sea': 'Dive into the deep sea and dance with glowing creatures.',
    }
};

export const useTranslations = (language: Language) => {
    return useCallback((key: TranslationKey, replacements?: Record<string, string | number>): string => {
        // Fallback logic: if a key doesn't exist in the current language, try Chinese, then default to the key itself.
        let text = translations[language]?.[key] || translations.zh[key] || key;
        if (replacements) {
            Object.entries(replacements).forEach(([keyToReplace, value]) => {
                text = text.replace(`{${keyToReplace}}`, String(value));
            });
        }
        return text;
    }, [language]);
};

// A silent audio clip to prevent errors when audio files are missing.
const SILENT_AUDIO = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';


export const SHOP_ITEMS: ShopItem[] = [
    // --- GAMES ---
    {
        id: 'sheep',
        icon: SheepIcon,
        category: 'game',
        cost: 0,
        color: 'text-gray-200',
        bgColor: 'bg-gray-700/50',
        gradientFrom: '#1f2937',
        gradientTo: '#111827',
        audioSrc: SILENT_AUDIO,
        gameType: 'count-generator',
    },
    {
        id: 'wooden-fish',
        icon: WoodenFishIcon,
        category: 'game',
        cost: 0,
        color: 'text-amber-100',
        bgColor: 'bg-amber-900/50',
        gradientFrom: '#78350f',
        gradientTo: '#422006',
        audioSrc: SILENT_AUDIO,
        gameType: 'tap-generator',
    },
    {
        id: 'dandelion',
        icon: DandelionIcon,
        category: 'game',
        cost: 0,
        color: 'text-white',
        bgColor: 'bg-sky-800/50',
        gradientFrom: '#075985',
        gradientTo: '#0c4a6e',
        audioSrc: SILENT_AUDIO,
        gameType: 'blow-generator',
    },
    {
        id: 'bubble-popper',
        icon: BubbleIcon,
        category: 'game',
        cost: 0,
        color: 'text-indigo-200',
        bgColor: 'bg-indigo-900/50',
        gradientFrom: '#312e81',
        gradientTo: '#1e1b4b',
        audioSrc: SILENT_AUDIO,
        gameType: 'popper',
    },
     {
        id: 'constellation',
        icon: ConstellationGameIcon,
        category: 'game',
        cost: 50,
        color: 'text-yellow-200',
        bgColor: 'bg-slate-800/50',
        gradientFrom: '#1e293b',
        gradientTo: '#0f172a',
        audioSrc: SILENT_AUDIO,
        gameType: 'drawing',
    },
    { id: 'moon-river', icon: MoonRiverGameIcon, category: 'game', cost: 75, color: 'text-blue-200', bgColor: 'bg-blue-900/50', gradientFrom: '#1e3a8a', gradientTo: '#1e1b4b', audioSrc: SILENT_AUDIO, gameType: 'fluid' },
    { id: 'cloud-sea', icon: CloudSeaGameIcon, category: 'game', cost: 75, color: 'text-slate-200', bgColor: 'bg-slate-600/50', gradientFrom: '#475569', gradientTo: '#1e293b', audioSrc: SILENT_AUDIO, gameType: 'discovery' },
    { id: 'secret-garden', icon: SecretGardenGameIcon, category: 'game', cost: 100, color: 'text-green-200', bgColor: 'bg-green-900/50', gradientFrom: '#14532d', gradientTo: '#052e16', audioSrc: SILENT_AUDIO, gameType: 'generative' },


    // --- SKINS ---
    { id: 'dream-sheep', icon: DreamSheepIcon, category: 'skin', cost: 50, gameId: 'sheep', color: 'text-purple-300', bgColor: 'bg-purple-900/50' },
    { id: 'crystal-fish', icon: CrystalFishIcon, category: 'skin', cost: 50, gameId: 'wooden-fish', color: 'text-cyan-300', bgColor: 'bg-cyan-900/50' },
    { id: 'bellflower', icon: BellflowerIcon, category: 'skin', cost: 40, gameId: 'dandelion', color: 'text-indigo-300', bgColor: 'bg-indigo-900/50' },
    { id: 'morning-dew', icon: MorningDewIcon, category: 'skin', cost: 40, gameId: 'bubble-popper', color: 'text-emerald-300', bgColor: 'bg-emerald-900/50' },

    // --- THEMES ---
    { id: 'default', icon: MoonIcon, category: 'theme', cost: 0, gradientFrom: '#1c192d', gradientTo: '#0f0f1b', bgColor: 'bg-slate-800/50' },
    { id: 'aurora-dream', icon: AuroraIcon, category: 'theme', cost: 100, gradientFrom: '#0c2a4c', gradientTo: '#040b13', bgColor: 'bg-green-900/50' },
    { id: 'serene-forest', icon: ForestIcon, category: 'theme', cost: 100, gradientFrom: '#1a2e2a', gradientTo: '#0a1a15', bgColor: 'bg-emerald-900/50' },
    { id: 'deep-sea', icon: DeepSeaIcon, category: 'theme', cost: 120, gradientFrom: '#001f3f', gradientTo: '#000c1a', bgColor: 'bg-blue-900/50' },

    // --- DECORATIONS ---
    { id: 'glowing-tree', icon: GlowingTreeIcon, category: 'decoration', cost: 150, color: 'text-emerald-300', bgColor: 'bg-emerald-900/50', animationStyle: 'pulse' },
    { id: 'crystal-tower', icon: CrystalTowerIcon, category: 'decoration', cost: 200, color: 'text-cyan-300', bgColor: 'bg-cyan-900/50', animationStyle: 'shimmer' },
    { id: 'sleeping-fox', icon: SleepingFoxIcon, category: 'decoration', cost: 120, color: 'text-orange-300', bgColor: 'bg-orange-900/50' },
    { id: 'dream-whale', icon: DreamWhaleIcon, category: 'decoration', cost: 250, color: 'text-purple-300', bgColor: 'bg-purple-900/50', animationStyle: 'swim' },
    { id: 'starflower', icon: StarflowerIcon, category: 'decoration', cost: 80, color: 'text-yellow-300', bgColor: 'bg-yellow-900/50', animationStyle: 'pulse' },
    { id: 'rainbow-geyser', icon: RainbowGeyserIcon, category: 'decoration', cost: 180, color: 'text-pink-300', bgColor: 'bg-pink-900/50', animationStyle: 'shimmer' },
    { id: 'jelly-aurora', icon: JellyAuroraIcon, category: 'decoration', cost: 160, color: 'text-fuchsia-300', bgColor: 'bg-fuchsia-900/50', animationStyle: 'sway' },
    { id: 'glimmer-sprites', icon: GlimmerSpritesIcon, category: 'decoration', cost: 100, color: 'text-lime-300', bgColor: 'bg-lime-900/50' },
    { id: 'stardust-waterfall', icon: StardustWaterfallIcon, category: 'decoration', cost: 220, color: 'text-slate-300', bgColor: 'bg-slate-800/50', animationStyle: 'shimmer' },
    { id: 'whispering-chime', icon: WhisperingChimeIcon, category: 'decoration', cost: 90, color: 'text-blue-300', bgColor: 'bg-blue-900/50', animationStyle: 'sway' },
    { id: 'luminous-jelly-tent', icon: LuminousJellyTentIcon, category: 'decoration', cost: 180, color: 'text-teal-300', bgColor: 'bg-teal-900/50', animationStyle: 'pulse' },
    { id: 'milky-way-path', icon: MilkyWayPathIcon, category: 'decoration', cost: 130, color: 'text-indigo-300', bgColor: 'bg-indigo-900/50' },
    { id: 'floating-crystal', icon: FloatingCrystalIcon, category: 'decoration', cost: 150, color: 'text-violet-300', bgColor: 'bg-violet-900/50', animationStyle: 'spin' },
    { id: 'cloud-sheep', icon: CloudSheepIcon, category: 'decoration', cost: 100, color: 'text-gray-300', bgColor: 'bg-gray-700/50' },
    { id: 'bubble-lamp', icon: BubbleLampIcon, category: 'decoration', cost: 90, color: 'text-sky-300', bgColor: 'bg-sky-900/50', animationStyle: 'pulse' },
    { id: 'cosmic-jellyfish', icon: CosmicJellyfishIcon, category: 'decoration', cost: 170, color: 'text-rose-300', bgColor: 'bg-rose-900/50', animationStyle: 'swim' },
];

export const ALL_STICKERS: Sticker[] = [
    {
        id: 'sheep-1',
        icon: SheepIcon,
        name: (t) => t('sheep'),
        getUnlockDescription: (t) => "游玩任意游戏1次 (Play any game once)",
        isUnlocked: (stats) => stats.sessionsPlayed >= 1,
    },
    {
        id: 'star-1',
        icon: StarIcon,
        name: (t) => "初升之星 (Rising Star)",
        getUnlockDescription: (t) => "总互动次数达到100次 (Total 100 interactions)",
        isUnlocked: (stats) => stats.totalClicks >= 100,
    },
    {
        id: 'moon-1',
        icon: MoonIcon,
        name: (t) => "月光漫步 (Moonwalker)",
        getUnlockDescription: (t) => "总游戏时长超过5分钟 (Total play time over 5 mins)",
        isUnlocked: (stats) => stats.totalDuration >= 300,
    },
    {
        id: 'cloud-1',
        icon: CloudIcon,
        name: (t) => "云中漫步 (Cloud Walker)",
        getUnlockDescription: (t) => "游玩3种不同的游戏 (Play 3 different games)",
        isUnlocked: (stats, history) => new Set(history.map(s => s.themeId)).size >= 3,
    },
    {
        id: 'heart-1',
        icon: HeartIcon,
        name: (t) => "爱心满满 (Full of Love)",
        getUnlockDescription: (t) => "完成一次Jelly的心愿 (Fulfill Jelly's wish once)",
        isUnlocked: (stats, history) => history.some(s => s.isWishFulfilled),
    },
    {
        id: 'music-1',
        icon: MusicIcon,
        name: (t) => "音乐家 (Musician)",
        getUnlockDescription: (t) => "在3个不同的日子里游玩 (Play on 3 different days)",
        isUnlocked: (stats) => stats.daysPlayed >= 3,
    },
    {
        id: 'paper-plane-1',
        icon: PaperPlaneIcon,
        name: (t) => "许愿者 (Wisher)",
        getUnlockDescription: (t) => "发送一个心愿 (Send a wish)",
        isUnlocked: (stats) => stats.wishesSent > 0,
    },
    {
        id: 'book-1',
        icon: BookIcon,
        name: (t) => "日记作家 (Diarist)",
        getUnlockDescription: (t) => "拥有超过3天的日记 (Have more than 3 days of diary entries)",
        isUnlocked: (stats) => stats.daysPlayed >= 3,
    },
    {
        id: 'key-1',
        icon: KeyIcon,
        name: (t) => "解锁者 (The Unlocker)",
        getUnlockDescription: (t) => "解锁一个新游戏 (Unlock a new game)",
        isUnlocked: (stats, history) => {
            const unlockedGameCount = SHOP_ITEMS.filter(item => {
                if (item.category !== 'game') return false;
                const themeName = translations.zh[item.id as TranslationKey];
                return (stats.sessionsPerTheme[themeName] || 0) > 0;
            }).length;
            return unlockedGameCount > 2; // Default 2 games are free
        },
    },
    {
        id: 'planet-1',
        icon: PlanetIcon,
        name: (t) => "行星居民 (Planet Resident)",
        getUnlockDescription: (t) => "装饰你的小行星 (Decorate your asteroid)",
        isUnlocked: (stats, history) => false, // This is unlocked via placing an item.
    },
    { id: 'cat-1', icon: CatIcon, name: (t) => "猫咪 (Cat)", getUnlockDescription: (t) => "游玩'敲敲乐'50次 (Play 'Zen Fish' 50 times)", isUnlocked: (stats) => (stats.sessionsPerTheme['敲敲乐'] || 0) >= 50 },
    { id: 'leaf-1', icon: LeafIcon, name: (t) => "叶子 (Leaf)", getUnlockDescription: (t) => "游玩10次游戏 (Play 10 sessions)", isUnlocked: (stats) => stats.sessionsPlayed >= 10 },
    { id: 'sun-1', icon: SunIcon, name: (t) => "太阳 (Sun)", getUnlockDescription: (t) => "在7个不同的日子里游玩 (Play on 7 different days)", isUnlocked: (stats) => stats.daysPlayed >= 7 },
    { id: 'feather-1', icon: FeatherIcon, name: (t) => "羽毛 (Feather)", getUnlockDescription: (t) => "总互动次数超过1000次 (Total interactions over 1000)", isUnlocked: (stats) => stats.totalClicks >= 1000 },
    { id: 'lantern-1', icon: LanternIcon, name: (t) => "灯笼 (Lantern)", getUnlockDescription: (t) => "收到一个星辰回响 (Receive a star echo)", isUnlocked: (stats) => stats.wishesReceived > 0 },
    { id: 'origami-1', icon: OrigamiBirdIcon, name: (t) => "千纸鹤 (Origami Bird)", getUnlockDescription: (t) => "发送10个心愿 (Send 10 wishes)", isUnlocked: (stats) => stats.wishesSent >= 10 },
    { id: 'teacup-1', icon: TeaCupIcon, name: (t) => "茶杯 (Tea Cup)", getUnlockDescription: (t) => "总游戏时长超过1小时 (Total play time over 1 hour)", isUnlocked: (stats) => stats.totalDuration >= 3600 },
];

export const bottleMessages = {
    zh: [
        "愿你的梦像星河一样璀璨。",
        "今夜的月光, 是为你而亮的。",
        "一颗小小的星星, 带着我的祝福, 划过你的窗前。",
        "别担心, 宇宙很大, 它会接住你所有的不安。",
        "晚安, 好梦。明天又是充满希望的一天。",
    ],
    en: [
        "May your dreams be as bright as the milky way.",
        "Tonight's moonlight is shining just for you.",
        "A little star, carrying my blessings, just streaked past your window.",
        "Don't worry, the universe is vast enough to hold all your anxieties.",
        "Good night, sweet dreams. Tomorrow is another day full of hope.",
    ]
};

export const PAGE_TURN_AUDIO = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

export const ALL_REPORTS = {
    zh: {
        'sheep': [
            "今晚, {clicks}只温顺的小羊跳过了你的梦境栅栏, 愿它们带你进入甜美的梦乡。",
            "你数了{clicks}只小羊, 每一只都带着一颗星星, 点亮了你的夜晚。",
        ],
        'wooden-fish': [
            "功德+{clicks}! 随着每一次平静的敲击, 你的心灵也变得更加宁静。晚安。",
            "今晚的{clicks}次敲击, 像是宇宙的节拍, 伴你安然入睡。",
        ],
        'dandelion': [
            "你吹散了{clicks}朵蒲公英, 它们的种子带着你的思绪, 飘向了远方的梦境。",
            "{clicks}次呼吸, {clicks}次放飞。愿你的烦恼也随风而去。",
        ],
        'bubble-popper': [
            "啵! 啵! {clicks}个烦恼随着泡泡一起消失了。现在, 安心睡吧。",
            "今晚, 你捏破了{clicks}个泡泡, 释放了压力, 迎接一个轻松的梦。",
        ],
        'constellation': [
            "你连接了{clicks}颗星星，绘制出了一幅夜空的心图。愿它守护你的梦。",
        ],
        'moon-river': [
            "月河因你的{clicks}次触摸而泛起涟漪，每一次波动都是宇宙温柔的回响。",
        ],
        'cloud-sea': [
            "在云海中，你找到了{clicks}个梦的碎片，愿它们编织你今晚的好梦。",
        ],
        'secret-garden': [
            "时光花园里，{clicks}株光之花因你而绽放，虽然短暂，却构成了永恒的美丽瞬间。",
        ],
    },
    en: {
        'sheep': [
            "Tonight, {clicks} gentle sheep jumped over your dream fence. May they guide you to sweet dreams.",
            "You counted {clicks} sheep, each carrying a star to brighten your night.",
        ],
        'wooden-fish': [
            "Karma +{clicks}! With each calm tap, your mind became more peaceful. Good night.",
            "Tonight's {clicks} taps were like the rhythm of the universe, lulling you to sleep.",
        ],
        'dandelion': [
            "You blew {clicks} dandelions, their seeds carrying your thoughts to distant dreams.",
            "{clicks} breaths, {clicks} wishes released. May your worries fly away with them.",
        ],
        'bubble-popper': [
            "Pop! Pop! {clicks} worries disappeared along with the bubbles. Now, sleep peacefully.",
            "Tonight, you popped {clicks} bubbles, releasing stress for a relaxing dream.",
        ],
        'constellation': [
            "You connected {clicks} stars, drawing a map of the night sky's heart. May it guard your dreams.",
        ],
        'moon-river': [
            "The moon river rippled from your {clicks} touches, each wave a gentle echo from the universe.",
        ],
        'cloud-sea': [
            "In the sea of clouds, you found {clicks} dream fragments. May they weave you a beautiful dream tonight.",
        ],
        'secret-garden': [
            "In the garden of time, {clicks} flowers of light bloomed for you. Though fleeting, they created moments of eternal beauty.",
        ],
    }
};

export const PRE_WRITTEN_ECHOS = {
    zh: [
        "你的心愿, 我已收到。它正在星辰间穿行, 寻找实现的方向。",
        "星空听到了你的低语, 并报以温柔的闪烁。",
        "愿望的种子已经种下, 请耐心等待它在宇宙的土壤里发芽。",
        "一道流星划过, 它说, 它会带着你的愿望去旅行。",
        "别怕, 你的声音虽小, 却足以在寂静的宇宙中激起回响。",
    ],
    en: [
        "Your wish has been received. It is now traveling among the stars, seeking its path.",
        "The night sky heard your whisper and twinkled softly in reply.",
        "The seed of your wish has been planted. Be patient as it sprouts in the cosmic soil.",
        "A shooting star just passed by. It said it would take your wish on a journey.",
        "Fear not. Your voice, though small, is enough to create an echo in the silent universe.",
    ]
};

export const HEALING_TIPS = {
    zh: [
        "深呼吸, 感受宇宙的宁静。",
        "闭上眼睛, 想象自己漂浮在星河之中。",
        "你也是宇宙中独一无二的闪亮星星。",
        "今天辛苦了, 给自己一个大大的拥抱吧。",
        "所有美好的事物都在奔你而来。",
    ],
    en: [
        "Take a deep breath and feel the tranquility of the cosmos.",
        "Close your eyes and imagine yourself floating in the Milky Way.",
        "You are a unique and shining star in this universe.",
        "You did well today. Give yourself a big hug.",
        "All good things are on their way to you.",
    ]
};

export const ZODIAC_CONSTELLATIONS = [
    { name: 'Aries', path: 'M -40 -10 L 0 0 L 40 10 L 50 30' },
    { name: 'Taurus', path: 'M -50 0 L -20 20 L 10 -10 L 40 10 L 60 -20' },
    { name: 'Gemini', path: 'M -40 -30 L -40 30 M -30 0 L 0 0 M 40 -30 L 40 30 M 30 0 L 0 0' },
    { name: 'Cancer', path: 'M -30 0 L 0 20 L 30 0 L 0 -20 Z' },
    { name: 'Leo', path: 'M -50 -20 L -20 0 L 10 20 L 40 10 L 60 -10' },
    { name: 'Virgo', path: 'M -50 -30 L -20 0 L 0 30 L 20 0 L 50 -30' },
    { name: 'Libra', path: 'M -50 10 L 50 10 M 0 -20 L 0 10' },
    { name: 'Scorpio', path: 'M -40 -20 L -10 0 L 20 -20 L 40 0 L 20 20 L -10 0' },
    { name: 'Sagittarius', path: 'M -30 -30 L 30 30 M -30 30 L 30 -30 M 0 0 L 50 0' },
    { name: 'Capricorn', path: 'M -40 -20 L 0 20 L 40 -20 L 20 0 L 0 20' },
    { name: 'Aquarius', path: 'M -50 -10 L -30 10 L -10 -10 L 10 10 L 30 -10 L 50 10' },
    { name: 'Pisces', path: 'M -40 0 L 0 20 L 40 0 L 0 -20 L -40 0 M 0 20 L 0 -20' },
];

export const CONSTELLATION_WORDS = {
    zh: {
        adjectives: ['宁静的', '闪亮的', '低语的', '遥远的', '温柔的', '孤独的', '守护的'],
        nounsOpen: ['小径', '弧光', '溪流', '飘带'],
        nounsClosed: ['圆环', '之心', '冠冕', '印记'],
        nounsCluster: ['星团', '迷雾', '花园', '碎片'],
    },
    en: {
        adjectives: ['The Silent', 'The Glimmering', 'The Whispering', 'The Distant', 'The Gentle', 'The Solitary', 'The Guardian'],
        nounsOpen: ['Path', 'Arc', 'River', 'Ribbon'],
        nounsClosed: ['Loop', 'Heart', 'Crown', 'Sigil'],
        nounsCluster: ['Cluster', 'Nebula', 'Garden', 'Fragment'],
    }
};

export const DREAM_FRAGMENTS = [
    { id: 'deer', icon: GlowingDeerIcon },
    { id: 'fish', icon: StarlightFishIcon },
    { id: 'cloud', icon: RainbowCloudIcon },
];