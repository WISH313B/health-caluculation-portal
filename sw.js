const CACHE_NAME = 'health-calculator-v1.0.0';
const urlsToCache = [
    '/',
    '/style.css',
    '/script.js',
    '/search.js',
    '/assets/js/faq.js',
    '/assets/images/favicon.png',
    '/calculators/pages/bmi.html',
    '/calculators/pages/bmr.html',
    '/calculators/pages/tdee.html',
    '/calculators/pages/body-fat.html',
    '/calculators/pages/pregnancy-due-date.html',
    '/calculators/pages/pregnancy-weight.html',
    '/calculators/pages/ovulation.html',
    '/calculators/pages/menstrual.html',
    '/calculators/pages/water-intake.html',
    '/calculators/pages/calories-burned.html',
    '/calculators/pages/meal-calories.html',
    '/calculators/pages/one-rep-max.html',
    '/calculators/pages/target-heart-rate.html',
    '/calculators/pages/pace.html',
    '/calculators/pages/exercise-intensity.html',
    '/calculators/pages/ideal-weight.html',
    '/calculators/pages/height-prediction.html',
    '/calculators/pages/sleep-time.html',
    '/calculators/pages/stress-index.html',
    '/calculators/pages/health-age.html',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// インストール時のキャッシュ
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// フェッチイベント（キャッシュファーストストラテジー）
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // キャッシュにあればそれを返す
                if (response) {
                    return response;
                }
                
                // キャッシュになければネットワークから取得
                return fetch(event.request).then(
                    function(response) {
                        // レスポンスが有効でない場合はそのまま返す
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // レスポンスをクローンしてキャッシュに保存
                        var responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    }
                );
            })
    );
});

// アクティベート時の古いキャッシュ削除
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// バックグラウンド同期
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // バックグラウンドでの同期処理
    return fetch('/api/sync')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log('Background sync completed');
        })
        .catch(function(error) {
            console.log('Background sync failed');
        });
}

// プッシュ通知
self.addEventListener('push', function(event) {
    const options = {
        body: event.data ? event.data.text() : '健康計算ポータルからの新しい情報があります',
        icon: '/assets/images/favicon.png',
        badge: '/assets/images/favicon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: '確認する',
                icon: '/assets/images/favicon.png'
            },
            {
                action: 'close',
                title: '閉じる',
                icon: '/assets/images/favicon.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('健康計算ポータル', options)
    );
});

// 通知クリック処理
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
}); 