/**
 * 健康ダイアリー統合管理システム
 * 全ての健康計算結果を一元管理し、時系列で追跡可能にする
 */

class HealthDiary {
    constructor() {
        this.storageKey = 'healthDiaryData';
        this.data = this.loadData();
        this.init();
    }

    /**
     * 初期化処理
     */
    init() {
        this.createSaveButton();
        this.bindEvents();
    }

    /**
     * データ構造の定義
     * @param {string} type - データの種類（bmi, bmr, tdee, body-fat, etc.）
     * @param {number|object} value - 計算結果の値
     * @param {string} unit - 単位
     * @param {object} metadata - 追加の情報（身長、体重、年齢など）
     */
    createDataEntry(type, value, unit = '', metadata = {}) {
        return {
            id: this.generateId(),
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD形式
            timestamp: new Date().toISOString(),
            type: type,
            value: value,
            unit: unit,
            metadata: metadata
        };
    }

    /**
     * ユニークIDを生成
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * データをlocalStorageから読み込み
     */
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('健康ダイアリーデータの読み込みエラー:', error);
            return [];
        }
    }

    /**
     * データをlocalStorageに保存
     */
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('健康ダイアリーデータの保存エラー:', error);
            return false;
        }
    }

    /**
     * 新しい健康データを追加
     */
    addEntry(type, value, unit = '', metadata = {}) {
        const entry = this.createDataEntry(type, value, unit, metadata);
        this.data.push(entry);
        this.saveData();
        this.showSuccessMessage(type);
        return entry;
    }

    /**
     * 特定の種類のデータを取得
     */
    getDataByType(type) {
        return this.data.filter(entry => entry.type === type)
                       .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    /**
     * 日付範囲でデータを取得
     */
    getDataByDateRange(startDate, endDate) {
        return this.data.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
        });
    }

    /**
     * ダイアリーに保存ボタンを各計算機ページに追加
     */
    createSaveButton() {
        // 既に結果が表示されている場合はボタンを追加
        const resultSection = document.getElementById('result-section');
        if (resultSection && resultSection.style.display !== 'none') {
            this.addSaveButtonToResult();
        }

        // 結果表示の監視（将来の計算結果表示に対応）
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.id === 'result-section' && target.style.display !== 'none') {
                        this.addSaveButtonToResult();
                    }
                }
            });
        });

        if (resultSection) {
            observer.observe(resultSection, { attributes: true });
        }
    }

    /**
     * 結果セクションに保存ボタンを追加
     */
    addSaveButtonToResult() {
        // 既にボタンがある場合は追加しない
        if (document.querySelector('.diary-save-button')) {
            return;
        }

        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons) {
            const saveButton = document.createElement('button');
            saveButton.className = 'diary-save-button secondary-button';
            saveButton.innerHTML = '<i class="fas fa-bookmark"></i> ダイアリーに記録';
            saveButton.onclick = () => this.saveCurrentResult();
            
            actionButtons.insertBefore(saveButton, actionButtons.firstChild);
        }
    }

    /**
     * 現在の計算結果をダイアリーに保存
     */
    saveCurrentResult() {
        const pageType = this.detectPageType();
        const result = this.extractResultData(pageType);
        
        if (result) {
            this.addEntry(result.type, result.value, result.unit, result.metadata);
        }
    }

    /**
     * 現在のページタイプを検出
     */
    detectPageType() {
        const url = window.location.pathname;
        
        if (url.includes('bmi')) return 'bmi';
        if (url.includes('bmr')) return 'bmr';
        if (url.includes('tdee')) return 'tdee';
        if (url.includes('body-fat')) return 'body-fat';
        if (url.includes('ideal-weight')) return 'ideal-weight';
        if (url.includes('calories-burned')) return 'calories-burned';
        if (url.includes('target-heart-rate')) return 'heart-rate';
        if (url.includes('water-intake')) return 'water-intake';
        if (url.includes('pregnancy-due-date')) return 'pregnancy';
        
        return 'unknown';
    }

    /**
     * ページから結果データを抽出
     */
    extractResultData(pageType) {
        let result = null;

        switch (pageType) {
            case 'bmi':
                const bmiValue = document.getElementById('bmi-value');
                const heightInput = document.getElementById('height');
                const weightInput = document.getElementById('weight');
                
                if (bmiValue && heightInput && weightInput) {
                    result = {
                        type: 'bmi',
                        value: parseFloat(bmiValue.textContent),
                        unit: '',
                        metadata: {
                            height: parseFloat(heightInput.value),
                            weight: parseFloat(weightInput.value),
                            category: document.getElementById('bmi-category')?.textContent || ''
                        }
                    };
                }
                break;

            case 'bmr':
                const bmrValue = document.getElementById('bmr-value');
                if (bmrValue) {
                    result = {
                        type: 'bmr',
                        value: parseFloat(bmrValue.textContent),
                        unit: 'kcal',
                        metadata: this.getCommonMetadata()
                    };
                }
                break;

            case 'tdee':
                const tdeeValue = document.getElementById('tdee-value');
                if (tdeeValue) {
                    result = {
                        type: 'tdee',
                        value: parseFloat(tdeeValue.textContent),
                        unit: 'kcal',
                        metadata: this.getCommonMetadata()
                    };
                }
                break;

            case 'body-fat':
                const bodyFatValue = document.getElementById('body-fat-value');
                if (bodyFatValue) {
                    result = {
                        type: 'body-fat',
                        value: parseFloat(bodyFatValue.textContent),
                        unit: '%',
                        metadata: this.getCommonMetadata()
                    };
                }
                break;

            case 'water-intake':
                const waterValue = document.getElementById('water-result');
                if (waterValue) {
                    result = {
                        type: 'water-intake',
                        value: parseFloat(waterValue.textContent),
                        unit: 'L',
                        metadata: this.getCommonMetadata()
                    };
                }
                break;
        }

        return result;
    }

    /**
     * 共通メタデータを取得
     */
    getCommonMetadata() {
        const metadata = {};
        
        // 身長・体重・年齢などの共通入力項目を収集
        const heightInput = document.getElementById('height');
        const weightInput = document.getElementById('weight');
        const ageInput = document.getElementById('age');
        const genderInputs = document.querySelectorAll('input[name="gender"]:checked');

        if (heightInput) metadata.height = parseFloat(heightInput.value);
        if (weightInput) metadata.weight = parseFloat(weightInput.value);
        if (ageInput) metadata.age = parseInt(ageInput.value);
        if (genderInputs.length > 0) metadata.gender = genderInputs[0].value;

        return metadata;
    }

    /**
     * 成功メッセージを表示
     */
    showSuccessMessage(type) {
        const typeNames = {
            'bmi': 'BMI',
            'bmr': '基礎代謝量',
            'tdee': '消費カロリー',
            'body-fat': '体脂肪率',
            'water-intake': '水分摂取量',
            'heart-rate': '心拍数',
            'pregnancy': '妊娠情報'
        };

        const message = `${typeNames[type] || '健康データ'}をダイアリーに記録しました！`;
        
        // トースト通知を表示
        this.showToast(message, 'success');
    }

    /**
     * 正しいダイアリーページのパスを取得
     */
    getDiaryPath() {
        const currentPath = window.location.pathname;
        
        // calculators/pages/ フォルダ内の場合
        if (currentPath.includes('calculators/pages/')) {
            return '../../my-diary.html';
        }
        // calculators/ フォルダ内の場合
        else if (currentPath.includes('calculators/')) {
            return '../my-diary.html';
        }
        // blog/ フォルダ内の場合
        else if (currentPath.includes('blog/')) {
            return '../my-diary.html';
        }
        // qa-hub/ フォルダ内の場合
        else if (currentPath.includes('qa-hub/')) {
            return '../my-diary.html';
        }
        // ルートディレクトリの場合
        else {
            return 'my-diary.html';
        }
    }

    /**
     * トースト通知を表示
     */
    showToast(message, type = 'info') {
        // 既存のトーストを削除
        const existingToast = document.querySelector('.health-diary-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const diaryPath = this.getDiaryPath();
        const toast = document.createElement('div');
        toast.className = `health-diary-toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
            <a href="${diaryPath}" class="toast-link">ダイアリーを見る</a>
        `;
        
        // CSSスタイルを動的に追加
        if (!document.querySelector('#health-diary-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'health-diary-toast-styles';
            style.textContent = `
                .health-diary-toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #28a745, #20c997);
                    color: white;
                    padding: 16px 20px;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(40, 167, 69, 0.3);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: slideInRight 0.3s ease;
                    max-width: 350px;
                    font-size: 14px;
                }
                
                .health-diary-toast i {
                    font-size: 18px;
                    opacity: 0.9;
                }
                
                .toast-link {
                    color: white;
                    text-decoration: underline;
                    font-weight: 500;
                    margin-left: auto;
                }
                
                .toast-link:hover {
                    color: #f8f9fa;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @media (max-width: 768px) {
                    .health-diary-toast {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // ダイアリーリンクのクリックイベントを設定
        const toastLink = toast.querySelector('.toast-link');
        if (toastLink) {
            toastLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = toastLink.href;
            });
        }

        // 5秒後に自動削除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    /**
     * データ統計を取得
     */
    getStatistics() {
        const stats = {
            totalEntries: this.data.length,
            dataTypes: {},
            recentActivity: this.data.slice(-5),
            longestStreak: this.calculateStreak()
        };

        // データタイプ別の統計
        this.data.forEach(entry => {
            if (!stats.dataTypes[entry.type]) {
                stats.dataTypes[entry.type] = 0;
            }
            stats.dataTypes[entry.type]++;
        });

        return stats;
    }

    /**
     * 連続記録日数を計算
     */
    calculateStreak() {
        const dates = [...new Set(this.data.map(entry => entry.date))].sort().reverse();
        let streak = 0;
        let today = new Date().toISOString().split('T')[0];
        
        for (let i = 0; i < dates.length; i++) {
            const expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() - i);
            const expectedDateStr = expectedDate.toISOString().split('T')[0];
            
            if (dates[i] === expectedDateStr) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    /**
     * イベントバインディング
     */
    bindEvents() {
        // ページ読み込み時にダイアリーリンクを追加
        this.addDiaryLinkToNavigation();
    }

    /**
     * ナビゲーションにダイアリーリンクを追加
     */
    addDiaryLinkToNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && !document.querySelector('.diary-nav-link')) {
            const diaryPath = this.getDiaryPath();
            const diaryLink = document.createElement('li');
            diaryLink.innerHTML = `<a href="${diaryPath}" class="nav-link diary-nav-link"><i class="fas fa-book"></i> マイダイアリー</a>`;
            navMenu.appendChild(diaryLink);
        }
    }

    /**
     * データをエクスポート（JSON形式）
     */
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `health-diary-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * データをクリア
     */
    clearData() {
        if (confirm('すべての健康ダイアリーデータを削除しますか？この操作は取り消せません。')) {
            this.data = [];
            this.saveData();
            this.showToast('健康ダイアリーのデータをクリアしました', 'info');
        }
    }
}

// グローバルインスタンスを作成
window.healthDiary = new HealthDiary();

// ページ読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', function() {
    if (window.healthDiary) {
        console.log('健康ダイアリーシステムが正常に初期化されました');
        
        // 開発者向け：コンソールでダイアリーデータを確認可能
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('健康ダイアリーデータ:', window.healthDiary.data);
            console.log('統計:', window.healthDiary.getStatistics());
        }
    }
});

// エクスポート関数（他のJSファイルから利用可能）
window.saveToHealthDiary = function(type, value, unit, metadata) {
    if (window.healthDiary) {
        return window.healthDiary.addEntry(type, value, unit, metadata);
    }
    return null;
}; 