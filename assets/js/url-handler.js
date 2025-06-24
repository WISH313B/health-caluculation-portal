// 環境に応じてURLを調整する関数
document.addEventListener('DOMContentLoaded', function() {
    // ローカル環境かどうかを判定
    const isLocal = window.location.protocol === 'file:';
    
    // 計算機のリンクを全て取得
    const calculatorLinks = document.querySelectorAll('.calculator-list a');
    
    calculatorLinks.forEach(link => {
        if (isLocal) {
            // ローカル環境では.htmlを付ける
            if (!link.href.endsWith('.html')) {
                link.href = link.href + '.html';
            }
        } else {
            // ウェブ環境では.htmlを除去
            link.href = link.href.replace('.html', '');
        }
    });
}); 