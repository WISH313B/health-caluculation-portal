// 環境に応じてURLを調整する関数
document.addEventListener('DOMContentLoaded', function() {
    // ローカル環境かどうかを判定
    const isLocal = window.location.protocol === 'file:';
    
    // 計算機のリンクを全て取得（クラスを拡張）
    const calculatorLinks = document.querySelectorAll('.calculator-list a, .calculator-link, .cta-button, [href*="calculators/pages/"]');
    
    calculatorLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;  // hrefが無い場合はスキップ
        
        if (href.includes('calculators/pages/')) {
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