import './style.css';
import { Router } from './router';
import { renderHome } from './pages/home';
import { renderSettings } from './pages/settings';

// アプリケーションの初期化
class App {
  private router: Router;
  private appElement: HTMLElement;

  constructor() {
    this.appElement = document.querySelector<HTMLDivElement>('#app')!;
    this.router = new Router();
    this.setupRoutes();
    this.router.start();
    this.initializeDarkMode();
    this.registerServiceWorker();
  }

  private setupRoutes(): void {
    // ルート登録
    this.router.register('home', () => {
      this.appElement.innerHTML = renderHome();
    });

    this.router.register('settings', () => {
      this.appElement.innerHTML = renderSettings();
    });
  }

  private initializeDarkMode(): void {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDarkMode);
  }

  private registerServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      addEventListener('load', () => {
        navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).then((reg) => {
          reg.addEventListener('updatefound', () => {
            const nw = reg.installing; if (!nw) return;
            nw.addEventListener('statechange', () => {
              if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                if (confirm('新しいバージョンがあります。今すぐ更新しますか？')) {
                  nw.postMessage('SKIP_WAITING');
                }
              }
            });
          });
        });
        navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
      });
    }
  }
}

// アプリケーション開始
new App();