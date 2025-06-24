// 環境に応じてURLを処理するための関数
function handleURLs() {
    // 開発環境かどうかを判定
    const isLocalEnvironment = window.location.hostname === 'localhost' || 
                             window.location.hostname === '127.0.0.1' ||
                             window.location.protocol === 'file:';

    // すべての内部リンクを取得（外部リンクを除外）
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return; // hrefが無いリンクはスキップ
        
        // 外部リンク、ハッシュリンク、メールリンクはスキップ
        if (href.startsWith('http://') || 
            href.startsWith('https://') || 
            href.startsWith('#') || 
            href.startsWith('mailto:') ||
            href.includes('?')) {
            return;
        }

        // 計算機ページまたは一般ページへのリンクを処理
        if (isLocalEnvironment) {
            // ローカル環境では.htmlを付ける
            if (!href.endsWith('.html')) {
                // 既に.htmlで終わっている場合は追加しない
                link.href = href + '.html';
            }
        } else {
            // 本番環境では.htmlを除去
            link.href = href.replace(/\.html$/, '');
        }
    });
}

// 即時実行
handleURLs();

// DOMの読み込み完了時に実行
document.addEventListener('DOMContentLoaded', handleURLs);

// 動的コンテンツ更新時の対応
const observer = new MutationObserver(handleURLs);
observer.observe(document.body, { 
    childList: true, 
    subtree: true 
}); 