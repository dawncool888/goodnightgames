export class NetworkDetector {
  private static instance: NetworkDetector;
  private isOnline: boolean = navigator.onLine;
  
  static getInstance(): NetworkDetector {
    if (!NetworkDetector.instance) {
      NetworkDetector.instance = new NetworkDetector();
    }
    return NetworkDetector.instance;
  }
  
  constructor() {
    this.setupListeners();
  }
  
  private setupListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 网络连接恢复');
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.warn('⚠️ 网络连接断开，切换到离线模式');
    });
  }
  
  // 检测网络状态
  async checkNetwork(): Promise<boolean> {
    // 基础在线状态
    if (!navigator.onLine) {
      this.isOnline = false;
      return false;
    }
    
    // 进一步检测网络质量（可选）
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      this.isOnline = response.ok;
      return response.ok;
    } catch {
      this.isOnline = false;
      return false;
    }
  }
  
  // 获取当前网络状态
  getNetworkStatus(): boolean {
    return this.isOnline;
  }
}
