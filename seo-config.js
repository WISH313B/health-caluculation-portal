// 高度なSEO設定とパフォーマンス最適化
// 健康計算ポータル専用設定

class SEOOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupCoreWebVitals();
        this.setupLazyLoading();
        this.setupPreloading();
        this.setupStructuredData();
        this.setupBreadcrumbs();
        this.setupSearchFunctionality();
        this.setupSocialSharing();
        this.setupPerformanceMonitoring();
        this.setupAccessibility();
    }

    // Core Web Vitals最適化
    setupCoreWebVitals() {
        // LCP (Largest Contentful Paint) 最適化
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                    // Google Analyticsに送信
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'web_vitals', {
                            name: 'LCP',
                            value: Math.round(entry.startTime),
                            event_category: 'Performance'
                        });
                    }
                }
            }
        });
        
        try {
            observer.observe({entryTypes: ['largest-contentful-paint']});
        } catch (e) {
            console.log('LCP monitoring not supported');
        }

        // CLS (Cumulative Layout Shift) 最適化
        let clsValue = 0;
        let clsEntries = [];
        
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    clsEntries.push(entry);
                }
            }
        });
        
        try {
            clsObserver.observe({entryTypes: ['layout-shift']});
        } catch (e) {
            console.log('CLS monitoring not supported');
        }

        // FID (First Input Delay) 最適化
        const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'web_vitals', {
                        name: 'FID',
                        value: Math.round(entry.processingStart - entry.startTime),
                        event_category: 'Performance'
                    });
                }
            }
        });
        
        try {
            fidObserver.observe({entryTypes: ['first-input']});
        } catch (e) {
            console.log('FID monitoring not supported');
        }
    }

    // 遅延読み込み設定
    setupLazyLoading() {
        // Intersection Observer for lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        // 遅延読み込み対象の画像を監視
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // プリロード設定
    setupPreloading() {
        // 重要なリソースのプリロード
        const criticalResources = [
            '/style.css',
            '/assets/images/favicon.png',
            '/google-analytics.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            if (resource.endsWith('.css')) {
                link.as = 'style';
            } else if (resource.endsWith('.js')) {
                link.as = 'script';
            } else if (resource.match(/\.(png|jpg|jpeg|webp)$/)) {
                link.as = 'image';
            }
            document.head.appendChild(link);
        });

        // 次に訪問する可能性の高いページのプリフェッチ
        const prefetchPages = [
            '/calculators/pages/bmi.html',
            '/calculators/pages/bmr.html',
            '/calculators/pages/pregnancy-due-date.html'
        ];

        prefetchPages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    }

    // 動的構造化データ
    setupStructuredData() {
        // ページビューに基づく動的構造化データ
        const pageData = {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'url': window.location.href,
            'dateModified': new Date().toISOString(),
            'inLanguage': 'ja-JP'
        };

        // 計算機ページの場合の追加データ
        if (window.location.pathname.includes('/calculators/')) {
            pageData['@type'] = 'WebApplication';
            pageData['applicationCategory'] = 'HealthApplication';
            pageData['operatingSystem'] = 'Any';
        }

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(pageData);
        document.head.appendChild(script);
    }

    // パンくずリスト自動生成
    setupBreadcrumbs() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment);
        
        if (segments.length > 0) {
            const breadcrumbData = {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                'itemListElement': []
            };

            // ホームページ
            breadcrumbData.itemListElement.push({
                '@type': 'ListItem',
                'position': 1,
                'name': 'ホーム',
                'item': window.location.origin + '/'
            });

            // 各セグメント
            let currentPath = '';
            segments.forEach((segment, index) => {
                currentPath += '/' + segment;
                breadcrumbData.itemListElement.push({
                    '@type': 'ListItem',
                    'position': index + 2,
                    'name': this.getSegmentName(segment),
                    'item': window.location.origin + currentPath
                });
            });

            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(breadcrumbData);
            document.head.appendChild(script);
        }
    }

    getSegmentName(segment) {
        const segmentNames = {
            'calculators': '計算機',
            'pages': '',
            'bmi': 'BMI計算機',
            'bmr': '基礎代謝量計算機',
            'pregnancy-due-date': '出産予定日計算機',
            'body-fat': '体脂肪率計算機',
            'calorie': 'カロリー計算機'
        };
        return segmentNames[segment] || segment;
    }

    // 検索機能強化
    setupSearchFunctionality() {
        const searchInput = document.querySelector('#search-input');
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });
        }
    }

    performSearch(query) {
        if (query.length < 2) return;

        // 検索結果のフィルタリング
        const calculators = document.querySelectorAll('.calculator-tile');
        let visibleCount = 0;

        calculators.forEach(calc => {
            const title = calc.querySelector('h3').textContent.toLowerCase();
            const description = calc.querySelector('p').textContent.toLowerCase();
            const searchTerm = query.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                calc.style.display = 'block';
                visibleCount++;
            } else {
                calc.style.display = 'none';
            }
        });

        // 検索結果の追跡
        if (typeof trackSearchUsage !== 'undefined') {
            trackSearchUsage(query, visibleCount);
        }
    }

    // ソーシャルシェア機能
    setupSocialSharing() {
        // 動的OGPタグの更新
        this.updateOGPTags();
        
        // シェアボタンの設定
        const shareButtons = document.querySelectorAll('.share-button');
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = button.dataset.platform;
                this.shareToSocial(platform);
            });
        });
    }

    updateOGPTags() {
        const title = document.title;
        const description = document.querySelector('meta[name="description"]')?.content || '';
        const url = window.location.href;
        const image = window.location.origin + '/assets/images/og-image.jpg';

        // OGPタグの動的更新
        this.updateMetaTag('property', 'og:title', title);
        this.updateMetaTag('property', 'og:description', description);
        this.updateMetaTag('property', 'og:url', url);
        this.updateMetaTag('property', 'og:image', image);
        
        // Twitter Cardタグの更新
        this.updateMetaTag('name', 'twitter:title', title);
        this.updateMetaTag('name', 'twitter:description', description);
        this.updateMetaTag('name', 'twitter:image', image);
    }

    updateMetaTag(attribute, name, content) {
        let tag = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attribute, name);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    }

    shareToSocial(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        const description = encodeURIComponent(
            document.querySelector('meta[name="description"]')?.content || ''
        );

        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            line: `https://social-plugins.line.me/lineit/share?url=${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            
            // シェア追跡
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    method: platform,
                    content_type: 'webpage',
                    content_id: window.location.pathname
                });
            }
        }
    }

    // パフォーマンス監視
    setupPerformanceMonitoring() {
        // ページロード時間の測定
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                const domReady = perfData.domContentLoadedEventEnd - perfData.navigationStart;
                
                console.log(`Page Load Time: ${loadTime}ms`);
                console.log(`DOM Ready Time: ${domReady}ms`);
                
                // パフォーマンスデータの送信
                if (typeof trackPerformance !== 'undefined') {
                    trackPerformance('page_load_time', loadTime);
                    trackPerformance('dom_ready_time', domReady);
                }
            }, 0);
        });

        // リソース読み込み時間の監視
        const resourceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 1000) { // 1秒以上かかったリソース
                    console.warn(`Slow resource: ${entry.name} (${entry.duration}ms)`);
                }
            }
        });
        
        try {
            resourceObserver.observe({entryTypes: ['resource']});
        } catch (e) {
            console.log('Resource monitoring not supported');
        }
    }

    // アクセシビリティ強化
    setupAccessibility() {
        // キーボードナビゲーション
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // スクリーンリーダー対応
        this.addAriaLabels();
        
        // 色覚異常対応
        this.setupColorBlindSupport();
    }

    addAriaLabels() {
        // 計算機タイルにaria-labelを追加
        const calculatorTiles = document.querySelectorAll('.calculator-tile');
        calculatorTiles.forEach(tile => {
            const title = tile.querySelector('h3')?.textContent;
            const description = tile.querySelector('p')?.textContent;
            if (title && description) {
                tile.setAttribute('aria-label', `${title}: ${description}`);
            }
        });

        // フォーム要素のラベル確認
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    input.setAttribute('aria-labelledby', label.id || 'label-' + input.id);
                }
            }
        });
    }

    setupColorBlindSupport() {
        // 高コントラストモードの検出
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }

        // 色覚異常対応のパターン追加
        const style = document.createElement('style');
        style.textContent = `
            @media (prefers-contrast: high) {
                :root {
                    --primary-color: #000000;
                    --background-color: #ffffff;
                    --text-color: #000000;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// SEO最適化の初期化
document.addEventListener('DOMContentLoaded', () => {
    new SEOOptimizer();
    console.log('SEO Optimizer initialized successfully');
});

// エラーハンドリング
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    
    // エラー追跡
    if (typeof trackError !== 'undefined') {
        trackError('javascript_error', e.error.message, window.location.href);
    }
});

// 未処理のPromise拒否の追跡
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    
    if (typeof trackError !== 'undefined') {
        trackError('promise_rejection', e.reason.toString(), window.location.href);
    }
});

// Service Worker登録（PWA対応）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 