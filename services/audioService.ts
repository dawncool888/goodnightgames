// services/audioService.ts
// 低音量、伴眠友好的音频服务

interface AudioManifest {
  bgm: string[];
  sfx: string[];
}

interface AudioPool {
  [key: string]: HTMLAudioElement[];
}

class AudioService {
  private bgmAudio: HTMLAudioElement | null = null;
  private sfxPool: AudioPool = {};
  private manifest: AudioManifest | null = null;
  private bgmVolume: number = 0.08; // 8% - 极低背景音量
  private sfxVolume: number = 0.12; // 12% - 轻柔音效音量
  private maxBgmVolume: number = 0.30; // 30% - BGM软上限
  private maxSfxVolume: number = 0.40; // 40% - SFX软上限
  private isBgmPlaying: boolean = false;
  private userInteracted: boolean = false;
  
  // 音频文件回退映射表
  private fallbackFiles: Record<string, string> = {
    // BGM
    'background': './bgm/background.mp3',
    
    // SFX
    'sheep': './sfx/sheep.mp3',
    'mokugyo': './sfx/mokugyo.mp3',
    'blow': './sfx/blow.mp3',
    'bubble': './sfx/bubble.mp3',
    'chime': './sfx/chime.ogg',
    'button': './sfx/button.mp3',
    'button1': './sfx/button1.mp3',
    'page-turn': './sfx/page-turn.mp3'
  };

  async initialize(): Promise<void> {
    console.log('🎵 初始化音频服务...');
    
    try {
      await this.loadManifest();
      this.setupAutoPlay();
      console.log('✅ 音频服务初始化完成');
    } catch (error) {
      console.warn('⚠️ 音频清单加载失败，使用回退音频:', error);
      this.manifest = {
        bgm: ['background'],
        sfx: ['sheep', 'mokugyo', 'blow', 'bubble', 'chime', 'button', 'button1', 'page-turn']
      };
    }
  }

  private async loadManifest(): Promise<void> {
    try {
      const response = await fetch('./music/manifest.json');
      if (!response.ok) throw new Error('Manifest not found');
      this.manifest = await response.json();
      console.log('📋 音频清单加载成功:', this.manifest);
    } catch (error) {
      console.warn('使用回退清单');
      throw error;
    }
  }

  private setupAutoPlay(): void {
    // 监听首次用户交互，自动播放BGM
    const playOnInteraction = () => {
      if (!this.userInteracted) {
        this.userInteracted = true;
        this.playBGM('background');
        
        // 移除监听器
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
      }
    };

    document.addEventListener('click', playOnInteraction);
    document.addEventListener('touchstart', playOnInteraction);
  }

  playBGM(name: string): void {
    if (this.isBgmPlaying) return;

    const src = this.fallbackFiles[name] || `./bgm/${name}.mp3`;
    
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio(src);
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0;
    }

    this.bgmAudio.play()
      .then(() => {
        console.log(`🎵 开始播放BGM: ${name}`);
        this.isBgmPlaying = true;
        this.fadeInBGM();
        this.startAmbientCycle();
      })
      .catch(err => {
        console.warn('BGM播放失败:', err);
      });
  }

  private fadeInBGM(): void {
    if (!this.bgmAudio) return;
    
    const step = 0.005;
    const interval = 100;
    const target = this.bgmVolume;

    const fade = setInterval(() => {
      if (!this.bgmAudio) {
        clearInterval(fade);
        return;
      }

      if (this.bgmAudio.volume < target) {
        this.bgmAudio.volume = Math.min(this.bgmAudio.volume + step, target);
      } else {
        clearInterval(fade);
      }
    }, interval);
  }

  fadeOutBGM(): void {
    if (!this.bgmAudio) return;

    const step = 0.005;
    const interval = 100;

    const fade = setInterval(() => {
      if (!this.bgmAudio) {
        clearInterval(fade);
        return;
      }

      if (this.bgmAudio.volume > 0) {
        this.bgmAudio.volume = Math.max(this.bgmAudio.volume - step, 0);
      } else {
        this.bgmAudio.pause();
        this.isBgmPlaying = false;
        clearInterval(fade);
      }
    }, interval);
  }

  private startAmbientCycle(): void {
    // 轻微音量波动，营造环境氛围
    setInterval(() => {
      if (!this.bgmAudio || !this.isBgmPlaying) return;

      const variance = 0.02;
      const newVolume = this.bgmVolume + (Math.random() - 0.5) * variance;
      this.bgmAudio.volume = Math.max(0, Math.min(newVolume, this.maxBgmVolume));
    }, 5000);
  }

  playSFX(name: string): void {
    const src = this.fallbackFiles[name] || `./sfx/${name}.mp3`;

    if (!this.sfxPool[name]) {
      this.sfxPool[name] = [];
    }

    // 从池中获取空闲音频
    let audio = this.sfxPool[name].find(a => a.paused);

    if (!audio) {
      audio = new Audio(src);
      audio.volume = this.applySoftProfile(this.sfxVolume);
      this.sfxPool[name].push(audio);
    }

    audio.currentTime = 0;
    audio.play().catch(err => {
      console.warn(`SFX播放失败 (${name}):`, err);
    });
  }

  private applySoftProfile(baseVolume: number): number {
    // 确保音效不会太刺耳
    return Math.min(baseVolume, this.maxSfxVolume);
  }

  stopBGM(): void {
    if (this.bgmAudio) {
      this.fadeOutBGM();
    }
  }

  setMusicEnabled(enabled: boolean): void {
    if (enabled) {
      if (!this.isBgmPlaying && this.userInteracted) {
        this.playBGM('background');
      }
    } else {
      this.stopBGM();
    }
  }

  setSFXEnabled(enabled: boolean): void {
    // SFX开关控制（如需要）
    console.log('SFX enabled:', enabled);
  }
}

const audioService = new AudioService();
export default audioService;
