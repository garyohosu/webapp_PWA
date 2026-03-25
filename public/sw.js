// Service Worker - App Shellキャッシュ戦略
const VERSION = 'v1.0.1';
const CACHE_NAME = 'pwa-cache-v1';
const APP_SHELL = [
  '/',
  '/index.html', 
  '/src/main.ts',
  '/src/style.css',
  '/src/router.ts',
  '/src/pages/home.ts',
  '/src/pages/settings.ts',
  '/manifest.webmanifest'
];

// インストール時：App Shellをキャッシュ
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...', VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(APP_SHELL);
      })
      .then(() => {
        console.log('Service Worker: Skip waiting');
        return self.skipWaiting();
      })
  );
});

// アクティベート時：古いキャッシュを削除
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim();
    })
  );
});

// フェッチ時：Cache Firstストラテジー
self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // キャッシュがあれば返す
        if (cachedResponse) {
          console.log('Service Worker: Cache hit', event.request.url);
          return cachedResponse;
        }
        
        // キャッシュがなければネットワークから取得
        console.log('Service Worker: Cache miss, fetching', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // レスポンスが有効な場合のみキャッシュ
            if (response && response.status === 200 && response.type === 'basic') {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // ネットワークエラー時のフォールバック
            console.log('Service Worker: Network failed, showing offline page');
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// メッセージイベント：SKIP_WAITING対応
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});