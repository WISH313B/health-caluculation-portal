/**
 * 動的関連コンテンツ表示機能
 * tags.jsonを参照して、現在のページに関連するコンテンツを自動表示
 */

class DynamicRecommendations {
    constructor() {
        this.tagsData = null;
        this.currentPageUrl = this.getCurrentPageUrl();
        this.maxRecommendations = 6;
        this.init();
    }
    
    async init() {
        try {
            await this.loadTagsData();
            this.renderRecommendations();
        } catch (error) {
            console.warn('Dynamic recommendations could not be loaded:', error);
        }
    }
    
    // tags.jsonを読み込み
    async loadTagsData() {
        const response = await fetch('tags.json');
        if (!response.ok) {
            // tags.jsonが見つからない場合、ルートディレクトリから試す
            const rootResponse = await fetch('../tags.json');
            if (!rootResponse.ok) {
                throw new Error('Tags data not found');
            }
            this.tagsData = await rootResponse.json();
        } else {
            this.tagsData = await response.json();
        }
    }
    
    // 現在のページURLを取得（正規化）
    getCurrentPageUrl() {
        let url = window.location.pathname;
        
        // 末尾のスラッシュを除去
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        
        // index.htmlの場合
        if (url === '' || url === '/index.html') {
            return 'index.html';
        }
        
        // ファイル拡張子がない場合は.htmlを追加
        if (!url.includes('.')) {
            url += '.html';
        }
        
        // 先頭のスラッシュを除去
        return url.startsWith('/') ? url.substring(1) : url;
    }
    
    // 現在のページのタグを取得
    getCurrentPageTags() {
        if (!this.tagsData) return [];
        
        // 全カテゴリから現在のページを検索
        for (const category in this.tagsData) {
            if (category === 'tagRelations') continue;
            
            const pages = this.tagsData[category];
            if (pages[this.currentPageUrl]) {
                return pages[this.currentPageUrl];
            }
        }
        
        return [];
    }
    
    // 関連ページを取得・スコア計算
    getRelatedPages() {
        const currentTags = this.getCurrentPageTags();
        if (currentTags.length === 0) return [];
        
        const relatedPages = new Map();
        
        // 全ページをスキャンしてスコア計算
        for (const category in this.tagsData) {
            if (category === 'tagRelations') continue;
            
            const pages = this.tagsData[category];
            for (const [pageUrl, pageTags] of Object.entries(pages)) {
                // 現在のページはスキップ
                if (pageUrl === this.currentPageUrl) continue;
                
                // 共通タグの数でスコア計算
                const commonTags = currentTags.filter(tag => pageTags.includes(tag));
                const score = this.calculateRelevanceScore(currentTags, pageTags, commonTags);
                
                if (score > 0) {
                    relatedPages.set(pageUrl, {
                        url: pageUrl,
                        tags: pageTags,
                        commonTags: commonTags,
                        score: score,
                        category: category
                    });
                }
            }
        }
        
        // スコア順でソートして上位を返す
        return Array.from(relatedPages.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, this.maxRecommendations);
    }
    
    // 関連度スコア計算（改良版）
    calculateRelevanceScore(currentTags, pageTags, commonTags) {
        if (commonTags.length === 0) return 0;
        
        // 基本スコア：共通タグ数
        let score = commonTags.length;
        
        // 重要タグの重み付け
        const importantTags = ['ダイエット', '女性の健康', '妊娠', '運動', 'BMI'];
        const importantCommonTags = commonTags.filter(tag => importantTags.includes(tag));
        score += importantCommonTags.length * 2;
        
        // タグ関連性による重み付け
        if (this.tagsData.tagRelations) {
            for (const currentTag of currentTags) {
                const relatedTags = this.tagsData.tagRelations[currentTag] || [];
                const relatedMatches = pageTags.filter(tag => relatedTags.includes(tag));
                score += relatedMatches.length * 0.5;
            }
        }
        
        // ジャカード係数による正規化
        const unionSize = new Set([...currentTags, ...pageTags]).size;
        const jaccardIndex = commonTags.length / unionSize;
        score = score * (1 + jaccardIndex);
        
        return score;
    }
    
    // ページタイトルとアイコンを取得
    getPageInfo(url, category) {
        const pageInfo = {
            title: this.generatePageTitle(url),
            icon: this.getPageIcon(url, category),
            description: this.generatePageDescription(url),
            url: url
        };
        
        return pageInfo;
    }
    
    // ページタイトル生成
    generatePageTitle(url) {
        const titleMap = {
            // 計算機
            'calculators/pages/bmi.html': 'BMI計算機',
            'calculators/pages/bmr.html': '基礎代謝量計算機',
            'calculators/pages/tdee.html': '1日の消費カロリー計算機',
            'calculators/pages/body-fat.html': '体脂肪率計算機',
            'calculators/pages/ideal-weight.html': '理想体重計算機',
            'calculators/pages/height-prediction.html': '身長予測計算機',
            'calculators/pages/meal-calories.html': '食事カロリー計算機',
            'calculators/pages/calories-burned.html': '運動消費カロリー計算機',
            'calculators/pages/one-rep-max.html': '最大重量(1RM)計算機',
            'calculators/pages/target-heart-rate.html': '目標心拍数計算機',
            'calculators/pages/pace.html': 'ペース計算機',
            'calculators/pages/exercise-intensity.html': '運動強度計算機',
            'calculators/pages/pregnancy-due-date.html': '出産予定日計算機',
            'calculators/pages/pregnancy-weight.html': '妊娠中の推奨体重計算機',
            'calculators/pages/safe-days.html': '危険日・安全日計算機',
            'calculators/pages/pregnancy-possibility.html': '妊娠可能性判定ツール',
            'calculators/pages/sleep-time.html': '睡眠時間計算機',
            'calculators/pages/water-intake.html': '必要水分量計算機',
            'calculators/pages/stress-index.html': 'ストレス指数計算機',
            'calculators/pages/health-age.html': '健康年齢計算機',
            
            // ブログ記事
            'blog/case-study-diet-challenge.html': '【実録】28歳A子の3ヶ月-5kgダイエット成功ストーリー',
            'blog/case-study-pms-improvement.html': '【実録】32歳B子のPMS改善3ヶ月チャレンジ',
            'blog/bmi-guide.html': 'BMI計算の完全ガイド',
            'blog/bmr-guide.html': '基礎代謝を効果的に上げる5つの方法',
            'blog/body-fat-reduction-guide.html': '体脂肪率を効果的に減らす方法',
            'blog/calorie-calculation-guide.html': '正確なカロリー計算でダイエット成功率を上げる方法',
            'blog/heart-rate-training-guide.html': '心拍数を活用した効果的なトレーニング方法',
            'blog/hydration-guide.html': '適切な水分摂取で健康的な生活を',
            'blog/nutrition-balance-guide.html': 'バランスの良い食事で健康的な体重管理を実現',
            'blog/ovulation-prediction-guide.html': '妊活成功のための排卵日予測',
            'blog/pregnancy-weight-guide.html': '妊娠中の体重管理：母体と赤ちゃんの健康のために',
            'blog/sleep-optimization-guide.html': '質の良い睡眠で健康寿命を延ばす',
            'blog/pms-complete-guide.html': 'PMS（月経前症候群）完全ガイド',
            'blog/onkatsu-guide.html': '体温管理（温活）完全ガイド',
            'blog/skincare-menstrual-cycle.html': 'スキンケアと月経周期',
            'blog/low-dose-pill-guide.html': '低用量ピル完全ガイド',
            'blog/morning-sickness-guide.html': 'つわりのピークはいつ？効果的な乗り切り方',
            'blog/womens-sleep-guide.html': '女性のための睡眠改善ガイド',
            'blog/healthy-snacking-guide.html': '健康的なおやつの選び方ガイド',
            'blog/intimate-care-guide.html': 'デリケートゾーンケア完全ガイド',
            'blog/body-image-self-esteem.html': 'ボディイメージと自己肯定感',
            
            // その他のページ
            'index.html': 'ホーム - 健康計算ポータル',
            'blog.html': '健康ブログ',
            'glossary.html': '健康用語集',
            'faq.html': 'よくある質問',
            'about.html': '運営者情報',
            'contact.html': 'お問い合わせ'
        };
        
        return titleMap[url] || url;
    }
    
    // ページアイコン取得
    getPageIcon(url, category) {
        if (url.includes('bmi')) return 'fas fa-weight';
        if (url.includes('bmr') || url.includes('tdee')) return 'fas fa-fire';
        if (url.includes('body-fat')) return 'fas fa-percentage';
        if (url.includes('pregnancy')) return 'fas fa-heart';
        if (url.includes('exercise') || url.includes('calories-burned')) return 'fas fa-running';
        if (url.includes('heart-rate') || url.includes('pace')) return 'fas fa-heartbeat';
        if (url.includes('sleep')) return 'fas fa-bed';
        if (url.includes('water')) return 'fas fa-tint';
        if (url.includes('stress')) return 'fas fa-brain';
        if (url.includes('meal') || url.includes('calorie')) return 'fas fa-utensils';
        if (url.includes('safe-days') || url.includes('ovulation')) return 'fas fa-calendar-alt';
        if (url.includes('max') || url.includes('strength')) return 'fas fa-dumbbell';
        if (url.includes('case-study')) return 'fas fa-chart-line';
        if (url.includes('pms')) return 'fas fa-venus';
        if (url.includes('diet')) return 'fas fa-apple-alt';
        if (category === 'blog') return 'fas fa-book-open';
        if (category === 'calculators') return 'fas fa-calculator';
        
        return 'fas fa-link';
    }
    
    // ページ説明生成
    generatePageDescription(url) {
        const descriptionMap = {
            'calculators/pages/bmi.html': '身長と体重からBMIを計算し、肥満度を判定します',
            'calculators/pages/bmr.html': '年齢・性別・身長・体重から基礎代謝量を算出します',
            'calculators/pages/tdee.html': '活動レベルを考慮した1日の総消費カロリーを計算します',
            'blog/case-study-diet-challenge.html': 'デスクワーク女性の健康的ダイエット成功体験談',
            'blog/case-study-pms-improvement.html': 'PMS症状改善のリアルな体験記録',
            'blog/bmi-guide.html': 'BMIの正しい理解と活用方法を詳しく解説',
            'blog/pms-complete-guide.html': 'PMS症状の理解から対策まで完全ガイド'
        };
        
        return descriptionMap[url] || '';
    }
    
    // 関連コンテンツHTML生成
    generateRecommendationHTML(relatedPages) {
        if (relatedPages.length === 0) {
            return '<p>関連コンテンツが見つかりませんでした。</p>';
        }
        
        let html = '<div class="dynamic-recommendations-grid">';
        
        relatedPages.forEach(page => {
            const pageInfo = this.getPageInfo(page.url, page.category);
            const isCalculator = page.category === 'calculators';
            const isBlog = page.category === 'blog';
            
            html += `
                <div class="recommendation-item ${page.category}">
                    <div class="recommendation-icon">
                        <i class="${pageInfo.icon}"></i>
                    </div>
                    <div class="recommendation-content">
                        <h4 class="recommendation-title">
                            <a href="${pageInfo.url}">${pageInfo.title}</a>
                        </h4>
                        ${pageInfo.description ? `<p class="recommendation-description">${pageInfo.description}</p>` : ''}
                        <div class="recommendation-tags">
                            ${page.commonTags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <div class="recommendation-type">
                            ${isCalculator ? '計算機' : isBlog ? 'ブログ記事' : 'ページ'}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
    
    // 関連コンテンツのスタイル追加
    addRecommendationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .dynamic-recommendations {
                margin: 2rem 0;
                padding: 2rem;
                background: #f8f9fa;
                border-radius: 12px;
                border: 1px solid #e9ecef;
            }
            
            .dynamic-recommendations h3 {
                color: #5C5452;
                margin-bottom: 1.5rem;
                font-size: 1.3rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .dynamic-recommendations-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
            }
            
            .recommendation-item {
                background: white;
                padding: 1.5rem;
                border-radius: 10px;
                border: 1px solid #e9ecef;
                transition: all 0.3s ease;
                display: flex;
                gap: 1rem;
            }
            
            .recommendation-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                border-color: #D98C7E;
            }
            
            .recommendation-icon {
                flex-shrink: 0;
                width: 48px;
                height: 48px;
                background: #D98C7E;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
            }
            
            .recommendation-item.calculators .recommendation-icon {
                background: #007bff;
            }
            
            .recommendation-item.blog .recommendation-icon {
                background: #28a745;
            }
            
            .recommendation-content {
                flex: 1;
            }
            
            .recommendation-title {
                margin: 0 0 0.5rem 0;
                font-size: 1rem;
                font-weight: 600;
            }
            
            .recommendation-title a {
                color: #5C5452;
                text-decoration: none;
                transition: color 0.3s ease;
            }
            
            .recommendation-title a:hover {
                color: #D98C7E;
            }
            
            .recommendation-description {
                font-size: 0.9rem;
                color: #6c757d;
                margin: 0.5rem 0;
                line-height: 1.4;
            }
            
            .recommendation-tags {
                display: flex;
                gap: 0.3rem;
                margin: 0.5rem 0;
                flex-wrap: wrap;
            }
            
            .recommendation-tags .tag {
                background: #e9ecef;
                color: #495057;
                padding: 0.2rem 0.5rem;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 500;
            }
            
            .recommendation-type {
                font-size: 0.8rem;
                color: #6c757d;
                font-weight: 500;
                margin-top: 0.5rem;
            }
            
            @media (max-width: 768px) {
                .dynamic-recommendations {
                    padding: 1.5rem;
                    margin: 1.5rem 0;
                }
                
                .dynamic-recommendations-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .recommendation-item {
                    padding: 1rem;
                    flex-direction: column;
                    text-align: center;
                }
                
                .recommendation-icon {
                    align-self: center;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // 関連コンテンツを描画
    renderRecommendations() {
        // スタイルを追加
        this.addRecommendationStyles();
        
        // 関連ページを取得
        const relatedPages = this.getRelatedPages();
        
        // 挿入先要素を探す
        const targetElement = document.getElementById('dynamic-recommendations');
        if (!targetElement) {
            console.warn('Dynamic recommendations container not found');
            return;
        }
        
        // HTML生成・挿入
        const recommendationHTML = `
            <div class="dynamic-recommendations">
                <h3>
                    <i class="fas fa-lightbulb"></i>
                    あわせて見たい関連コンテンツ
                </h3>
                ${this.generateRecommendationHTML(relatedPages)}
            </div>
        `;
        
        targetElement.innerHTML = recommendationHTML;
        
        // ページビューをトラッキング（Google Analytics等）
        this.trackRecommendationView(relatedPages);
    }
    
    // 推奨表示のトラッキング
    trackRecommendationView(relatedPages) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_recommendations', {
                event_category: 'dynamic_content',
                event_label: this.currentPageUrl,
                value: relatedPages.length
            });
        }
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    // ページにdynamic-recommendationsコンテナがある場合のみ実行
    if (document.getElementById('dynamic-recommendations')) {
        new DynamicRecommendations();
    }
});

// 手動実行用関数（必要に応じて）
window.initDynamicRecommendations = function() {
    new DynamicRecommendations();
};

// エクスポート（モジュール環境での使用時）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicRecommendations;
} 