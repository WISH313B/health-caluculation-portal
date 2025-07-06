/**
 * 健康用語集 自動リンク機能
 * 記事本文中の健康用語を自動的にglossary.htmlへのリンクに変換
 */

// 用語リスト（用語名とリンク先のアンカー）
const glossaryTerms = {
    'BMI': 'section-ha',
    'ボディマスインデックス': 'section-ha',
    'PMS': 'section-ha',
    '月経前症候群': 'section-ha',
    '基礎代謝量': 'section-ka',
    '基礎代謝': 'section-ka',
    'TDEE': 'section-ta',
    '総消費エネルギー量': 'section-ta',
    '体脂肪率': 'section-ta',
    '理想体重': 'section-ri',
    '目標心拍数': 'section-mi',
    '心拍数': 'section-mi',
    '水分摂取量': 'section-mi',
    '水分補給': 'section-mi',
    '排卵日': 'section-o',
    '安全日': 'section-a',
    '危険日': 'section-ki',
    '妊娠可能性': 'section-ni',
    '運動強度': 'section-u',
    '運動消費カロリー': 'section-u',
    'カロリー': 'section-ka',
    'ストレス指数': 'section-su',
    'ストレス': 'section-su',
    '睡眠時間': 'section-su',
    '1RM': 'section-i',
    '1レップマックス': 'section-i',
    'ワンレップマックス': 'section-i',
    'エストロゲン': 'section-e',
    '黄体期': 'section-o',
    'イライラ': 'section-i'
};

// 自動リンク機能の実装
function addGlossaryLinks() {
    // 対象となる要素を取得（記事本文、ブログ記事など）
    const targetSelectors = [
        'article .article-content',
        '.blog-post .post-content',
        '.post-content p',
        '.article-content p',
        '.article-content li',
        '.term-definition'
    ];
    
    let targetElements = [];
    
    // 対象要素を収集
    targetSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        targetElements = targetElements.concat(Array.from(elements));
    });
    
    // 重複を除去
    targetElements = [...new Set(targetElements)];
    
    // 各要素の処理
    targetElements.forEach(element => {
        // 既にリンクが設定されている要素やリンク内の要素はスキップ
        if (element.tagName === 'A' || element.closest('a')) {
            return;
        }
        
        processElement(element);
    });
}

// 要素内のテキストを処理
function processElement(element) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // リンク内のテキストはスキップ
                if (node.parentNode.tagName === 'A' || node.parentNode.closest('a')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    // 各テキストノードを処理
    textNodes.forEach(textNode => {
        const originalText = textNode.textContent;
        let newHTML = originalText;
        const processedTerms = new Set(); // 同じ用語を複数回処理しないため
        
        // 用語の長さでソート（長い用語から先に処理）
        const sortedTerms = Object.keys(glossaryTerms).sort((a, b) => b.length - a.length);
        
        sortedTerms.forEach(term => {
            if (processedTerms.has(term)) {
                return;
            }
            
            const regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi');
            const matches = originalText.match(regex);
            
            if (matches) {
                // 最初の1回だけリンクを作成
                newHTML = newHTML.replace(regex, (match) => {
                    if (!processedTerms.has(term)) {
                        processedTerms.add(term);
                        return createGlossaryLink(match, glossaryTerms[term]);
                    }
                    return match;
                });
            }
        });
        
        // HTMLが変更された場合のみ置換
        if (newHTML !== originalText) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newHTML;
            
            // テキストノードを新しいHTMLで置換
            const parent = textNode.parentNode;
            while (tempDiv.firstChild) {
                parent.insertBefore(tempDiv.firstChild, textNode);
            }
            parent.removeChild(textNode);
        }
    });
}

// 用語集リンクを作成
function createGlossaryLink(term, anchor) {
    return `<a href="glossary.html#${anchor}" class="glossary-link" title="${term}の詳細を見る">${term}</a>`;
}

// 正規表現エスケープ
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 用語集リンクのスタイル追加
function addGlossaryLinkStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .glossary-link {
            color: #D98C7E;
            text-decoration: none;
            border-bottom: 1px dotted #D98C7E;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .glossary-link:hover {
            color: #C7776A;
            border-bottom-color: #C7776A;
            text-decoration: none;
        }
        
        .glossary-link::after {
            content: "📖";
            font-size: 0.8em;
            margin-left: 2px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .glossary-link:hover::after {
            opacity: 1;
        }
        
        /* モバイル対応 */
        @media (max-width: 768px) {
            .glossary-link {
                border-bottom: 1px solid #D98C7E;
            }
            
            .glossary-link::after {
                display: none;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// 初期化
function initGlossaryLinker() {
    // スタイルを追加
    addGlossaryLinkStyles();
    
    // DOM読み込み完了後に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addGlossaryLinks);
    } else {
        addGlossaryLinks();
    }
}

// 実行
initGlossaryLinker();

// 動的コンテンツ対応（必要に応じて）
window.refreshGlossaryLinks = function() {
    addGlossaryLinks();
};

// エクスポート（モジュール環境での使用時）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addGlossaryLinks,
        glossaryTerms,
        createGlossaryLink
    };
} 