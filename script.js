// 検索機能
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const gridContainer = document.querySelector('.grid-container');
    
    // 計算機データ
    const calculators = [
        { name: 'BMI計算機', url: 'calculators/bmi.html', category: '体重・体型に関する計算', keywords: 'BMI ボディマスインデックス 体重 肥満度' },
        { name: '理想体重計算機', url: 'calculators/ideal-weight.html', category: '体重・体型に関する計算', keywords: '理想体重 標準体重 適正体重' },
        { name: '体脂肪率計算機', url: 'calculators/body-fat.html', category: '体重・体型に関する計算', keywords: '体脂肪率 体脂肪 脂肪' },
        { name: '身長予測計算機', url: 'calculators/height-prediction.html', category: '体重・体型に関する計算', keywords: '身長予測 成長 子供 将来身長' },
        { name: '基礎代謝量計算機', url: 'calculators/bmr.html', category: 'カロリー・代謝に関する計算', keywords: '基礎代謝量 BMR カロリー 消費' },
        { name: '1日の消費カロリー計算機', url: 'calculators/tdee.html', category: 'カロリー・代謝に関する計算', keywords: 'TDEE 総消費カロリー 1日消費 代謝' },
        { name: '食事カロリー計算機', url: 'calculators/meal-calories.html', category: 'カロリー・代謝に関する計算', keywords: '食事カロリー 料理 食べ物' },
        { name: '運動消費カロリー計算機', url: 'calculators/calories-burned.html', category: 'カロリー・代謝に関する計算', keywords: '運動消費カロリー 運動 エクササイズ' },
        { name: '最大重量(1RM)計算機', url: 'calculators/one-rep-max.html', category: 'フィットネス・運動関連', keywords: '最大重量 1RM 筋トレ ワンレップマックス' },
        { name: '目標心拍数計算機', url: 'calculators/target-heart-rate.html', category: 'フィットネス・運動関連', keywords: '目標心拍数 心拍 有酸素運動' },
        { name: 'ペース計算機', url: 'calculators/pace.html', category: 'フィットネス・運動関連', keywords: 'ペース ランニング マラソン 走行' },
        { name: '運動強度計算機', url: 'calculators/exercise-intensity.html', category: 'フィットネス・運動関連', keywords: '運動強度 負荷 トレーニング' },
        { name: '出産予定日計算機', url: 'calculators/pregnancy-due-date.html', category: '妊娠・女性の健康関連', keywords: '出産予定日 妊娠 分娩 マタニティ' },
        { name: '妊娠中の推奨体重計算機', url: 'calculators/pregnancy-weight.html', category: '妊娠・女性の健康関連', keywords: '妊娠中体重 妊婦 体重増加' },
        { name: '危険日・安全日計算機', url: 'calculators/safe-days.html', category: '妊娠・女性の健康関連', keywords: '危険日計算 安全日計算 避妊 生理周期 排卵日' },
        { name: '妊娠可能性判定ツール', url: 'calculators/pregnancy-possibility.html', category: '妊娠・女性の健康関連', keywords: '妊娠可能性計算 妊娠判定 妊娠症状 生理遅れ' },
        { name: '睡眠時間計算機', url: 'calculators/sleep-time.html', category: 'その他の健康関連計算', keywords: '睡眠時間 睡眠 休息 就寝' },
        { name: '必要水分量計算機', url: 'calculators/water-intake.html', category: 'その他の健康関連計算', keywords: '必要水分量 水分補給 水 脱水' },
        { name: 'ストレス指数計算機', url: 'calculators/stress-index.html', category: 'その他の健康関連計算', keywords: 'ストレス指数 ストレス 精神的 心理' },
        { name: '健康年齢計算機', url: 'calculators/health-age.html', category: 'その他の健康関連計算', keywords: '健康年齢 健康状態 生活習慣 ヘルス' }
    ];

    // 検索結果表示エリアを作成
    if (!document.getElementById('search-results')) {
        const searchResultsDiv = document.createElement('div');
        searchResultsDiv.id = 'search-results';
        searchResultsDiv.style.display = 'none';
        searchResultsDiv.innerHTML = `
            <h2>検索結果</h2>
            <div id="search-results-container"></div>
            <button id="clear-search" type="button">検索をクリア</button>
        `;
        document.querySelector('main').appendChild(searchResultsDiv);
    }

    // 検索実行関数
    function performSearch(searchTerm) {
        if (!searchTerm.trim()) {
            clearSearch();
            return;
        }

        const results = calculators.filter(calc => {
            const searchText = searchTerm.toLowerCase();
            return calc.name.toLowerCase().includes(searchText) ||
                   calc.keywords.toLowerCase().includes(searchText) ||
                   calc.category.toLowerCase().includes(searchText);
        });

        displaySearchResults(results, searchTerm);
    }

    // 検索結果表示関数
    function displaySearchResults(results, searchTerm) {
        const searchResultsContainer = document.getElementById('search-results-container');
        const searchResults = document.getElementById('search-results');
        
        searchResultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            searchResultsContainer.innerHTML = '<p>検索結果が見つかりませんでした。</p>';
        } else {
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                
                const highlightedName = highlightText(result.name, searchTerm);
                
                resultItem.innerHTML = `
                    <a href="${result.url}">${highlightedName}</a>
                    <div class="search-result-category">${result.category}</div>
                `;
                
                searchResultsContainer.appendChild(resultItem);
            });
        }

        // 検索結果を表示し、元のコンテンツを非表示
        searchResults.style.display = 'block';
        gridContainer.style.display = 'none';
    }

    // テキストハイライト関数
    function highlightText(text, searchTerm) {
        if (!searchTerm.trim()) return text;
        
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // 正規表現エスケープ関数
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 検索クリア関数
    function clearSearch() {
        const searchResults = document.getElementById('search-results');
        
        searchInput.value = '';
        searchResults.style.display = 'none';
        gridContainer.style.display = 'grid';
    }

    // イベントリスナー
    searchInput.addEventListener('input', function() {
        performSearch(this.value);
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(this.value);
        }
    });

    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });

    // 検索クリアボタンのイベントリスナー
    setTimeout(() => {
        const clearSearchButton = document.getElementById('clear-search');
        if (clearSearchButton) {
            clearSearchButton.addEventListener('click', clearSearch);
        }
    }, 100);

    // Escapeキーで検索をクリア
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });
}); 