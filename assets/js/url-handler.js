// 環境に応じてURLを調整する関数
document.addEventListener('DOMContentLoaded', function() {
    // ローカル環境かどうかを判定
    const isLocal = window.location.protocol === 'file:';
    
    // 調整が必要なリンクを全て取得
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;  // hrefが無い場合はスキップ
        
        // 外部リンク（http://やhttps://で始まるもの）はスキップ
        if (href.startsWith('http://') || href.startsWith('https://')) {
            return;
        }
        
        // ハッシュリンク（#で始まるもの）はスキップ
        if (href.startsWith('#')) {
            return;
        }
        
        // メールリンク（mailto:で始まるもの）はスキップ
        if (href.startsWith('mailto:')) {
            return;
        }

        // 計算機ページまたは一般ページへのリンクを処理
        if (href.includes('calculators/pages/') || 
            href.endsWith('privacy-policy') || 
            href.endsWith('privacy-policy.html') ||
            href.endsWith('terms-of-service') || 
            href.endsWith('terms-of-service.html') ||
            href.endsWith('about') ||
            href.endsWith('about.html') ||
            href.endsWith('contact') ||
            href.endsWith('contact.html') ||
            href.endsWith('faq') ||
            href.endsWith('faq.html')) {
            
            if (isLocal) {
                // ローカル環境では.htmlを付ける
                if (!href.endsWith('.html')) {
                    link.href = href + '.html';
                }
            } else {
                // ウェブ環境では.htmlを除去
                link.href = href.replace('.html', '');
            }
        }
    });
}); 