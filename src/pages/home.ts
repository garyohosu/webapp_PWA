// ホーム画面
export function renderHome(): string {
  return `
    <div class="page">
      <header class="header">
        <h1>Mobile PWA</h1>
      </header>
      
      <main class="main">
        <div class="welcome-card">
          <h2>ようこそ</h2>
          <p>これはモバイル向けPWAの最小実装です。</p>
        </div>
        
        <div class="features">
          <div class="feature-item">
            <h3>📱 レスポンシブ</h3>
            <p>モバイルファーストデザイン</p>
          </div>
          
          <div class="feature-item">
            <h3>⚡ 高速</h3>
            <p>Service Workerによるキャッシュ</p>
          </div>
          
          <div class="feature-item">
            <h3>📦 インストール可能</h3>
            <p>ホーム画面に追加可能</p>
          </div>
        </div>
        
        <button class="btn btn-primary" onclick="location.hash='settings'">
          設定画面へ
        </button>
      </main>
    </div>
  `;
}