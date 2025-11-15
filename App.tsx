import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Import components
import ThemeSelector from './components/ThemeSelector';
import GameScreen from './components/GameScreen';
import ReportScreen from './components/ReportScreen';
import CollectionScreen from './components/CollectionScreen';
import SettingsModal from './components/SettingsModal';
import Header from './components/layout/Header';
import FooterNav from './components/layout/FooterNav';
import MessageModal from './components/MessageModal';
import WishShop from './components/WishShop';
import WishSenderModal from './components/WishSenderModal';
import StarrySkyLogbook from './components/StarrySkyLogbook';
import AdPromptModal from './components/AdPromptModal';
import AdLimitModal from './components/AdLimitModal';
import MyAsteroidScreen from './components/MyAsteroidScreen';
import LoadingScreen from './components/LoadingScreen';
import LoginBonusModal from './components/LoginBonusModal';


// Import types and constants
import type { Screen, GameTheme, GameState, Settings, GameStats, DriftingStar, ShopItem, SentWish, ReceivedWish, TranslationKey, DailyStats, AdPlacement, PlacedDecoration, User } from './types';
import { SHOP_ITEMS, ALL_STICKERS, useTranslations, bottleMessages, translations } from './constants';
import { generateEchoForWish } from './services/geminiService';
import { showRewardedAd } from './services/adService';

// Import custom hook
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAuth } from './hooks/useAuth';

// Helper function to get today's date string in YYYY-MM-DD format, respecting local timezone
const getTodayDateString = () => {
    const today = new Date();
    // Use local date parts to construct the string, avoiding timezone issues
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const initialDailyStats: DailyStats = {
    date: getTodayDateString(),
    plays: 0,
    wishesSent: 0,
    adsWatched: {
        extra_plays: 0,
        extra_wishes: 0,
        coin_reward: 0,
    }
};

function App() {
    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);

    const [screen, setScreen] = useState<Screen>('themeSelector');
    const [selectedTheme, setSelectedTheme] = useState<GameTheme | null>(null);
    
    const [settings, setSettings] = useLocalStorage<Settings>('settings', {
        language: 'zh',
        music: true,
        sfx: true,
        activeTheme: 'default',
        activeSkins: {},
        hasDecoratedBefore: false,
        decorationInventory: {},
    });
    
    const [history, setHistory] = useLocalStorage<GameState[]>('gameHistory', []);
    const [unlockedStickers, setUnlockedStickers] = useLocalStorage<string[]>('unlockedStickers', ['sheep-1']);
    
    // --- ADVERTISEMENT & DAILY LIMITS STATE ---
    const [dailyStats, setDailyStats] = useLocalStorage<DailyStats>('dailyStats', initialDailyStats);
    const [adPrompt, setAdPrompt] = useState<{ isOpen: boolean; type: AdPlacement | null; isAnimatingOut: boolean; }>({ isOpen: false, type: null, isAnimatingOut: false });
    const [adLimitModal, setAdLimitModal] = useState<{ isOpen: boolean; isAnimatingOut: boolean }>({ isOpen: false, isAnimatingOut: false });


    // --- WISH & CURRENCY STATE ---
    const [wishCoins, setWishCoins] = useLocalStorage<number>('wishCoins', 50);
    const [unlockedItems, setUnlockedItems] = useLocalStorage<string[]>('unlockedItems', 
        SHOP_ITEMS.filter(item => item.cost <= 0).map(item => item.id)
    );
    const [sentWishes, setSentWishes] = useLocalStorage<SentWish[]>('sentWishes', []);
    const [receivedWishes, setReceivedWishes] = useLocalStorage<ReceivedWish[]>('receivedWishes', []);
    const [placedDecorations, setPlacedDecorations] = useLocalStorage<PlacedDecoration[]>('placedDecorations', []);


    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSettingsAnimatingOut, setIsSettingsAnimatingOut] = useState(false);
    
    // --- AUTHENTICATION STATE ---
    const [isLoginBonusModalOpen, setIsLoginBonusModalOpen] = useState(false);
    const [isLoginBonusAnimatingOut, setIsLoginBonusAnimatingOut] = useState(false);

    const handleFirstLogin = useCallback(() => {
        // Award login bonus and show the modal
        setWishCoins(c => c + 100);
        setIsLoginBonusModalOpen(true);
    }, [setWishCoins]);
    const { user, login } = useAuth(handleFirstLogin);
    
    // --- INTERACTIVE BACKGROUND STATE & REFS ---
    const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: string; }[]>([]);
    const [shootingStars, setShootingStars] = useState<{ id: number; top: string; left: string; duration: string; delay: string; }[]>([]);
    const starBgRef = useRef<HTMLDivElement>(null);
    const shootingStarId = useRef(0);
    const [trail, setTrail] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
    const trailId = useRef(0);
    const lastTrailTime = useRef(0);
    const [isMoving, setIsMoving] = useState(false);
    const moveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- MESSAGE IN A BOTTLE / WISHING STATE ---
    const [driftingStars, setDriftingStars] = useState<DriftingStar[]>([]);
    const driftingStarId = useRef(0);
    const [messageModal, setMessageModal] = useState<{ isOpen: boolean; message: string; isAnimatingOut: boolean; }>({ isOpen: false, message: '', isAnimatingOut: false });
    const [isWishSenderOpen, setIsWishSenderOpen] = useState(false);
    const [isWishSenderAnimatingOut, setIsWishSenderAnimatingOut] = useState(false);


    const t = useTranslations(settings.language);

    const unlockedGameThemes = useMemo(() => {
        return SHOP_ITEMS.filter(item => item.category === 'game' && unlockedItems.includes(item.id)) as GameTheme[];
    }, [unlockedItems]);

    // Jelly's Daily Wish - calculated once per day
    const jellysWishTheme = useMemo(() => {
        const date = new Date();
        const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const availableGames = SHOP_ITEMS.filter(item => item.category === 'game' && item.cost === 0);
        return availableGames[dayOfYear % availableGames.length] as GameTheme;
    }, []);
    
    const activeTheme = useMemo(() => {
        return SHOP_ITEMS.find(item => item.id === settings.activeTheme && item.category === 'theme') || SHOP_ITEMS.find(item => item.id === 'default');
    }, [settings.activeTheme]);


    // --- EFFECTS ---
     // Loading Screen Effect
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);
     // Daily Stats Reset Effect
    useEffect(() => {
        const today = getTodayDateString();
        if (dailyStats.date !== today) {
            setDailyStats(initialDailyStats);
        }
    }, []); // Runs once on app load

    // Initial Decoration Gift Effect
    useEffect(() => {
        const hasReceivedGift = localStorage.getItem('hasReceivedInitialGift');
        if (!hasReceivedGift) {
            setSettings(s => {
                const newInventory = { ...s.decorationInventory };
                if (!newInventory['glowing-tree']) {
                    newInventory['glowing-tree'] = 1;
                }
                return { ...s, decorationInventory: newInventory };
            });
            localStorage.setItem('hasReceivedInitialGift', 'true');
        }
    }, [setSettings]);


     // Data migration for old wish formats
    useEffect(() => {
        const migrateWishes = () => {
            const oldSentWishes = localStorage.getItem('sentWishes');
            if (oldSentWishes && oldSentWishes.startsWith('[')) {
                try {
                    const parsed = JSON.parse(oldSentWishes);
                    if (parsed.length > 0 && typeof parsed[0] === 'string') {
                        const newSentWishes: SentWish[] = parsed.map((text: string, index: number) => ({
                            id: `migrated-sent-${index}-${Date.now()}`,
                            text,
                            timestamp: Date.now() - (parsed.length - index) * 24 * 60 * 60 * 1000,
                            status: 'returned',
                            echo: 'A memory from a past sky.',
                        }));
                        setSentWishes(newSentWishes);
                    }
                } catch (e) { console.error("Failed to migrate sent wishes", e); }
            }

            const oldReceivedWishes = localStorage.getItem('receivedWishes');
            if (oldReceivedWishes && oldReceivedWishes.startsWith('[')) {
                 try {
                    const parsed = JSON.parse(oldReceivedWishes);
                    if (parsed.length > 0 && typeof parsed[0] === 'string') {
                        const newReceivedWishes: ReceivedWish[] = parsed.map((text: string, index: number) => ({
                            id: `migrated-received-${index}-${Date.now()}`,
                            text,
                            timestamp: Date.now() - (parsed.length - index) * 24 * 60 * 60 * 1000,
                        }));
                        setReceivedWishes(newReceivedWishes);
                    }
                } catch (e) { console.error("Failed to migrate received wishes", e); }
            }
        };
        migrateWishes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Initialize stars
    useEffect(() => {
        const newStars = Array.from({ length: 100 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 1.5 + 0.5, // 0.5px to 2px
            delay: `${Math.random() * 10}s`,
        }));
        setStars(newStars);
    }, []);

    // Parallax, Mouse Trail, and Movement Detection effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            
            if (starBgRef.current) {
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;
                const parallaxFactor = 40;
                const moveX = (clientX / innerWidth - 0.5) * parallaxFactor;
                const moveY = (clientY / innerHeight - 0.5) * parallaxFactor;
                starBgRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }

            setIsMoving(true);
            if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
            moveTimeoutRef.current = setTimeout(() => setIsMoving(false), 200);

            if (now - lastTrailTime.current > 30) {
                const id = trailId.current++;
                const size = Math.random() * 8 + 4;
                const newParticle = { id, x: e.clientX, y: e.clientY, size };
                setTrail(prev => [...prev, newParticle]);
                lastTrailTime.current = now;
                setTimeout(() => setTrail(prev => prev.filter(p => p.id !== id)), 1000);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
        };
    }, []);

    // Shooting star generator
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        const createShootingStar = () => {
            const id = shootingStarId.current++;
            const duration = Math.random() * 5 + 5;
            const newStar = { id, top: `${Math.random() * 50}%`, left: `${Math.random() * 100}%`, duration: `${duration}s`, delay: `0s` };
            setShootingStars(prev => [...prev, newStar]);
            setTimeout(() => setShootingStars(prev => prev.filter(s => s.id !== id)), duration * 1000 + 500);
        };
        const scheduleNextStar = () => {
            timer = setTimeout(() => {
                createShootingStar();
                scheduleNextStar();
            }, Math.random() * 10000 + 8000);
        };
        scheduleNextStar();
        return () => clearTimeout(timer);
    }, []);
    
    // Drifting Message Star generator
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        const createDriftingStar = () => {
             if (driftingStars.length >= 3 || screen === 'game' || screen === 'logbook') return;
            const id = driftingStarId.current++;
            const newStar: DriftingStar = { id, x: Math.random() * 80 + 10, y: Math.random() * 70 + 15, size: Math.random() * 4 + 8, delay: `${Math.random() * 3}s` };
            setDriftingStars(prev => [...prev, newStar]);
        };
        const scheduleNextDriftingStar = () => {
            timer = setTimeout(() => {
                createDriftingStar();
                scheduleNextDriftingStar();
            }, Math.random() * 5000 + 8000);
        };
        scheduleNextDriftingStar();
        return () => clearTimeout(timer);
    }, [driftingStars.length, screen]);


    // Check for sticker unlocks when history changes
    useEffect(() => {
        const stats: GameStats = history.reduce((acc, session) => {
            acc.totalClicks += session.clicks;
            acc.totalDuration += session.duration;
            acc.sessionsPlayed += 1;
            
            const theme = SHOP_ITEMS.find(t => t.id === session.themeId);
            if(!theme || theme.category !== 'game') return acc;
            
            const themeName = translations.zh[theme.id as TranslationKey]; // Key is Chinese name
            acc.clicksPerTheme[themeName] = (acc.clicksPerTheme[themeName] || 0) + session.clicks;
            acc.sessionsPerTheme[themeName] = (acc.sessionsPerTheme[themeName] || 0) + 1;
            return acc;
        }, {
            totalClicks: 0,
            totalDuration: 0,
            sessionsPlayed: 0,
            clicksPerTheme: {},
            sessionsPerTheme: {},
            daysPlayed: new Set(history.map(s => s.date)).size,
            wishesSent: sentWishes.length,
            wishesReceived: receivedWishes.length,
        });

        const newlyUnlocked = ALL_STICKERS.filter(sticker => 
            !unlockedStickers.includes(sticker.id) && sticker.isUnlocked(stats, history)
        );
        
        if (newlyUnlocked.length > 0) {
            setUnlockedStickers(prev => [...new Set([...prev, ...newlyUnlocked.map(s => s.id)])]);
        }
    }, [history, unlockedStickers, setUnlockedStickers, sentWishes, receivedWishes]);


    // --- HANDLERS ---
    const handleThemeSelect = (theme: GameTheme) => {
        if (dailyStats.plays >= 3) {
            if (dailyStats.adsWatched.extra_plays < 3) {
                setAdPrompt({ isOpen: true, type: 'extra_plays', isAnimatingOut: false });
            } else {
                setAdLimitModal({ isOpen: true, isAnimatingOut: false });
            }
        } else {
            setSelectedTheme(theme);
            setScreen('game');
        }
    };

    const handleGameEnd = useCallback((session: Omit<GameState, 'date' | 'isWishFulfilled'>) => {
        const today = getTodayDateString();
        const isWishFulfilled = session.themeId === jellysWishTheme.id;
        
        const newGameState: GameState = { ...session, date: today, isWishFulfilled };
        setHistory(prev => [...prev, newGameState]);
        
        setDailyStats(d => ({ ...d, plays: d.plays + 1 }));

        // Award Wish Coins
        const baseReward = 5;
        const bonusReward = isWishFulfilled ? 10 : 0;
        setWishCoins(c => c + baseReward + bonusReward);

        setSelectedTheme(null);
        setScreen('report');
    }, [setHistory, setDailyStats, jellysWishTheme.id, setWishCoins]);

    const handlePurchase = (item: ShopItem) => {
        if (wishCoins >= item.cost) {
            setWishCoins(c => c - item.cost);
            if (item.category === 'decoration') {
                setSettings(s => {
                    const newInventory = { ...s.decorationInventory };
                    newInventory[item.id] = (newInventory[item.id] || 0) + 1;
                    return { ...s, decorationInventory: newInventory };
                });
            } else {
                // For non-decoration items, just add to unlocked list if not already there
                if (!unlockedItems.includes(item.id)) {
                   setUnlockedItems(prev => [...prev, item.id]);
                }
            }
            return true;
        }
        return false;
    };

    const navigateTo = (screen: Screen) => {
        if (screen === 'game' && !selectedTheme) {
            setScreen('themeSelector');
        } else {
            setScreen(screen);
        }
    };

    const openSettings = () => setIsSettingsOpen(true);

    const closeSettings = () => {
        setIsSettingsAnimatingOut(true);
        setTimeout(() => {
            setIsSettingsOpen(false);
            setIsSettingsAnimatingOut(false);
        }, 500);
    };

    const handleDriftingStarClick = (starId: number) => {
        const messages = bottleMessages[settings.language];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setMessageModal({ isOpen: true, message: randomMessage, isAnimatingOut: false });
        setDriftingStars(prev => prev.filter(s => s.id !== starId));
    };
    
    const closeMessageModal = () => {
        setMessageModal(prev => ({ ...prev, isAnimatingOut: true }));
        setWishCoins(c => c + 1); // Reward for receiving a wish
        if(messageModal.message) {
             const newWish: ReceivedWish = {
                id: `received-${Date.now()}`,
                text: messageModal.message,
                timestamp: Date.now(),
            };
            setReceivedWishes(prev => [...prev, newWish]);
        }
        setTimeout(() => setMessageModal({ isOpen: false, message: '', isAnimatingOut: false }), 500);
    };

    const handleOpenWishSender = () => {
        if (dailyStats.wishesSent >= 3) {
             if (dailyStats.adsWatched.extra_wishes < 3) {
                setAdPrompt({ isOpen: true, type: 'extra_wishes', isAnimatingOut: false });
            } else {
                setAdLimitModal({ isOpen: true, isAnimatingOut: false });
            }
        } else {
            setIsWishSenderOpen(true);
        }
    };
    
    const closeWishSender = () => {
        setIsWishSenderAnimatingOut(true);
        setTimeout(() => {
            setIsWishSenderOpen(false);
            setIsWishSenderAnimatingOut(false);
        }, 500);
    };

    const handleSendWish = (wishText: string) => {
         const newWish: SentWish = {
            id: `sent-${Date.now()}`,
            text: wishText,
            timestamp: Date.now(),
            status: 'traveling',
        };
        setSentWishes(prev => [...prev, newWish]);
        setWishCoins(c => c + 2); // Reward for sending a wish
        setDailyStats(d => ({ ...d, wishesSent: d.wishesSent + 1 }));
        closeWishSender();
    };
    
    const handleGenerateEcho = async (wishId: string): Promise<boolean> => {
        const wish = sentWishes.find(w => w.id === wishId);
        if (!wish) return false;

        try {
            const echoText = await generateEchoForWish(wish.text, settings.language);
            setSentWishes(prevWishes => 
                prevWishes.map(w => 
                    w.id === wishId ? { ...w, status: 'returned', echo: echoText } : w
                )
            );
            return true;
        } catch (error) {
            console.error("Failed to generate echo:", error);
            // Optionally set an error state on the wish
            setSentWishes(prevWishes => 
                prevWishes.map(w => 
                    w.id === wishId ? { ...w, status: 'returned', echo: t('reportError') } : w
                )
            );
            return false;
        }
    };
    
    const handleCoinsAdClick = () => {
        if (dailyStats.adsWatched.coin_reward < 3) {
            setAdPrompt({ isOpen: true, type: 'coin_reward', isAnimatingOut: false });
        } else {
            setAdLimitModal({ isOpen: true, isAnimatingOut: false });
        }
    };

    const closeAdPrompt = () => {
        setAdPrompt(p => ({ ...p, isAnimatingOut: true }));
        setTimeout(() => {
            setAdPrompt({ isOpen: false, type: null, isAnimatingOut: false });
        }, 500);
    };

    const closeAdLimitModal = () => {
        setAdLimitModal({ isOpen: false, isAnimatingOut: true });
        setTimeout(() => {
            setAdLimitModal({ isOpen: false, isAnimatingOut: false });
        }, 500);
    };

    const closeLoginBonusModal = () => {
        setIsLoginBonusAnimatingOut(true);
        setTimeout(() => {
            setIsLoginBonusModalOpen(false);
            setIsLoginBonusAnimatingOut(false);
        }, 500);
    };
    
    const handleConfirmAd = async () => {
        if (!adPrompt.type) return;
        const placement = adPrompt.type;
        closeAdPrompt();

        const result = await showRewardedAd(placement);

        if (result.success && result.reward) {
            if (result.reward.type === 'plays') {
                setDailyStats(d => ({
                    ...d,
                    plays: d.plays - result.reward.amount, // This effectively gives them more plays
                    adsWatched: { ...d.adsWatched, [placement]: d.adsWatched[placement] + 1 }
                }));
            } else if (result.reward.type === 'wishes') {
                setDailyStats(d => ({
                    ...d,
                    wishesSent: d.wishesSent - result.reward.amount,
                    adsWatched: { ...d.adsWatched, [placement]: d.adsWatched[placement] + 1 }
                }));
            } else if (result.reward.type === 'coins') {
                setWishCoins(c => c + result.reward.amount);
                 setDailyStats(d => ({
                    ...d,
                    adsWatched: { ...d.adsWatched, [placement]: d.adsWatched[placement] + 1 }
                }));
            }
        }
    };



    // --- RENDER LOGIC ---

    const renderScreen = () => {
        const activeSkinId = selectedTheme ? settings.activeSkins[selectedTheme.id] : undefined;
        switch (screen) {
            case 'game':
                if (selectedTheme) return <GameScreen theme={selectedTheme} activeSkinId={activeSkinId} onGameEnd={handleGameEnd} settings={settings} />;
                navigateTo('themeSelector');
                return null;
            case 'report':
                return <ReportScreen history={history} settings={settings} dailyReportCount={dailyStats.plays || 0} onNavigateToLogbook={() => navigateTo('logbook')} />;
            case 'collection':
                return <CollectionScreen unlockedStickers={unlockedStickers} sessionHistory={history} sentWishesCount={sentWishes.length} receivedWishesCount={receivedWishes.length} settings={settings} />;
            case 'shop':
                return <WishShop settings={settings} setSettings={setSettings} wishCoins={wishCoins} setWishCoins={setWishCoins} unlockedItems={unlockedItems} onPurchase={handlePurchase} onCoinsAdClick={handleCoinsAdClick} />;
            case 'logbook':
                return <StarrySkyLogbook sentWishes={sentWishes} receivedWishes={receivedWishes} onGenerateEcho={handleGenerateEcho} settings={settings} />;
            case 'asteroid':
                return <MyAsteroidScreen settings={settings} setSettings={setSettings} placedDecorations={placedDecorations} setPlacedDecorations={setPlacedDecorations} />;
            case 'themeSelector':
            default:
                return <ThemeSelector 
                    onThemeSelect={handleThemeSelect} 
                    onOpenWishSender={handleOpenWishSender} 
                    settings={settings} 
                    jellysWishTheme={jellysWishTheme as GameTheme} 
                    unlockedThemes={unlockedGameThemes} 
                    navigateTo={navigateTo}
                    wishCoins={wishCoins}
                    onPurchase={handlePurchase}
                    onCoinsAdClick={handleCoinsAdClick}
                />;
        }
    };
    
    const mainBgStyle = { background: `linear-gradient(to bottom, ${activeTheme?.gradientFrom}, ${activeTheme?.gradientTo})` };
    
    const shouldShowStarBg = screen !== 'game' && screen !== 'logbook';

    return (
        <main className="w-screen h-screen overflow-hidden text-white font-sans relative flex items-center justify-center transition-colors duration-500" style={mainBgStyle}>
            <LoadingScreen isLoading={isLoading} settings={settings} />

            {trail.map(p => (
                <div key={p.id} className="trail-particle" style={{ left: `${p.x}px`, top: `${p.y}px`, width: `${p.size}px`, height: `${p.size}px`, transform: 'translate(-50%, -50%)' }} />
            ))}
            
            {shouldShowStarBg && (
                 <div ref={starBgRef} id="star-bg" className="absolute inset-[-50px] transition-transform duration-100 ease-out z-0">
                    {stars.map(star => (
                        <div key={star.id} className={`absolute bg-white rounded-full animate-twinkle ${isMoving ? 'fast-twinkle' : ''}`} style={{ left: `${star.x}%`, top: `${star.y}%`, width: `${star.size}px`, height: `${star.size}px`, animationDelay: star.delay, boxShadow: `0 0 ${star.size + 1}px 0px rgba(255,255,255,0.7)` }} />
                    ))}
                    {shootingStars.map(star => (
                        <div key={star.id} className="shooting-star" style={{ top: star.top, left: star.left, animationName: 'shoot', animationTimingFunction: 'linear', animationIterationCount: '1', animationFillMode: 'forwards', animationDuration: star.duration, animationDelay: star.delay }} />
                    ))}
                </div>
            )}
            
            {shouldShowStarBg && driftingStars.map(star => (
                 <button key={star.id} onClick={() => handleDriftingStarClick(star.id)} className="absolute bg-jelly-pink rounded-full drifting-star cursor-pointer z-20" style={{ left: `${star.x}%`, top: `${star.y}%`, width: `${star.size}px`, height: `${star.size}px`, animationDelay: star.delay }} aria-label="Catch a message from the stars" />
            ))}

            <Header onLogoClick={() => navigateTo('themeSelector')} onSettingsClick={openSettings} wishCoins={wishCoins} onCoinsClick={handleCoinsAdClick} user={user} onLoginClick={login} />

            <div className={`w-full h-full max-w-4xl mx-auto px-4 flex justify-center relative z-10 ${screen === 'asteroid' ? '' : 'pb-28 pt-[126px]'} no-scrollbar overflow-y-auto ${screen === 'themeSelector' || screen === 'logbook' || screen === 'asteroid' ? 'items-start' : 'items-center'}`}>
                {renderScreen()}
            </div>
            
            {screen !== 'game' && (
                <FooterNav activeScreen={screen} navigateTo={navigateTo} settings={settings} />
            )}

            {isSettingsOpen && (
                <SettingsModal settings={settings} setSettings={setSettings} onClose={closeSettings} isAnimatingOut={isSettingsAnimatingOut} unlockedItems={unlockedItems} />
            )}

            {messageModal.isOpen && (
                <MessageModal message={messageModal.message} onClose={closeMessageModal} isAnimatingOut={messageModal.isAnimatingOut} settings={settings} />
            )}
            
            {isWishSenderOpen && (
                <WishSenderModal 
                    onClose={closeWishSender}
                    onSend={handleSendWish}
                    isAnimatingOut={isWishSenderAnimatingOut}
                    settings={settings}
                />
            )}

            {adPrompt.isOpen && (
                <AdPromptModal
                    type={adPrompt.type}
                    onConfirm={handleConfirmAd}
                    onClose={closeAdPrompt}
                    isAnimatingOut={adPrompt.isAnimatingOut}
                    settings={settings}
                />
            )}

            {adLimitModal.isOpen && (
                <AdLimitModal
                    onClose={closeAdLimitModal}
                    isAnimatingOut={adLimitModal.isAnimatingOut}
                    settings={settings}
                />
            )}

            {isLoginBonusModalOpen && (
                <LoginBonusModal
                    onClose={closeLoginBonusModal}
                    isAnimatingOut={isLoginBonusAnimatingOut}
                    settings={settings}
                    bonusAmount={100}
                />
            )}
        </main>
    );
}

export default App;