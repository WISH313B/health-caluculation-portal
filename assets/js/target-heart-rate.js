// 運動強度ゾーン
const heartRateZones = [
    { id: 'veryLight', min: 50, max: 60, name: '極軽度' },
    { id: 'light', min: 60, max: 70, name: '軽度' },
    { id: 'moderate', min: 70, max: 80, name: '中度' },
    { id: 'hard', min: 80, max: 90, name: '強度' },
    { id: 'maximum', min: 90, max: 100, name: '最大' }
];

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', () => {
    // 入力要素の取得
    const form = document.getElementById('heart-rate-form');
    const resultSection = document.getElementById('result-section');
    const ageInput = document.getElementById('age');
    const restingHRInput = document.getElementById('restingHR');
    const formulaSelect = document.getElementById('formula');
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');

    // 短縮URL生成関数
    function getShortUrl() {
        // 短縮URL形式で返す（実際のドメインに合わせて調整）
        const path = window.location.pathname;
        const fileName = path.split('/').pop().replace('.html', '');
        return `https://minna-no-kenko.com/${fileName}`;
    }

    // フォーム送信の処理
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateTargetHeartRates();
        resultSection.style.display = 'block';
        form.style.display = 'none';
        
        // ページの最上部までスムーズにスクロール
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    });

    // イベントリスナーの設定（リアルタイム計算用）
    [ageInput, restingHRInput, formulaSelect].forEach(input => {
        input.addEventListener('input', () => {
            if (resultSection.style.display === 'block') {
                calculateTargetHeartRates();
            }
        });
    });

    // 再計算ボタンのクリック処理
    recalculateButton.addEventListener('click', () => {
        // 入力値をリセット
        ageInput.value = '';
        restingHRInput.value = '';
        formulaSelect.selectedIndex = 0;
        
        // セクションの表示切り替え
        resultSection.style.display = 'none';
        form.style.display = 'block';
    });

    // シェアボタンのクリック処理
    shareButton.addEventListener('click', () => {
        const age = ageInput.value || '25';
        const maxHR = document.getElementById('maxHeartRate').textContent;
        const formula = formulaSelect.options[formulaSelect.selectedIndex].text;
        
        // 短縮URLを取得
        const currentUrl = getShortUrl();
        
        const tweetText = `${age}歳の私の最大心拍数は${maxHR}bpmでした！（${formula}で計算）\n#健康計算ポータル #目標心拍数\n\n${currentUrl}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(tweetUrl, '_blank');
    });

    // 入力値の検証
    ageInput.addEventListener('change', function() {
        validateNumber(this, 1, 120);
    });

    restingHRInput.addEventListener('change', function() {
        validateNumber(this, 40, 100);
    });
});

// 最大心拍数の計算
function calculateMaxHeartRate(age, formula) {
    switch (formula) {
        case 'simple':
            return 220 - age;
        case 'tanaka':
            return 208 - (0.7 * age);
        case 'karvonen':
            return 220 - age; // カーボネン法でも最大心拍数は同じ計算式を使用
        default:
            return 220 - age;
    }
}

// 目標心拍数の計算
function calculateTargetHeartRate(maxHR, intensity, restingHR, formula) {
    if (formula === 'karvonen' && restingHR) {
        // カーボネン法
        return Math.round(((maxHR - restingHR) * (intensity / 100)) + restingHR);
    } else {
        // 通常の計算
        return Math.round(maxHR * (intensity / 100));
    }
}

// すべての目標心拍数を計算
function calculateTargetHeartRates() {
    const age = parseInt(document.getElementById('age').value) || 20;
    const restingHR = parseInt(document.getElementById('restingHR').value) || 60;
    const formula = document.getElementById('formula').value;

    // 最大心拍数の計算
    const maxHeartRate = calculateMaxHeartRate(age, formula);
    document.getElementById('maxHeartRate').textContent = maxHeartRate;

    // 各ゾーンの心拍数を計算
    heartRateZones.forEach(zone => {
        const minHeartRate = calculateTargetHeartRate(maxHeartRate, zone.min, restingHR, formula);
        const maxZoneHeartRate = calculateTargetHeartRate(maxHeartRate, zone.max, restingHR, formula);
        
        // 結果の表示
        const element = document.getElementById(`${zone.id}HR`);
        if (element) {
            element.textContent = `${minHeartRate}-${maxZoneHeartRate}`;
        }
    });

    // カーボネン法の場合、安静時心拍数の入力を必須にする
    const restingHRInput = document.getElementById('restingHR');
    if (formula === 'karvonen') {
        restingHRInput.required = true;
        restingHRInput.parentElement.parentElement.classList.add('required');
    } else {
        restingHRInput.required = false;
        restingHRInput.parentElement.parentElement.classList.remove('required');
    }
}

// 数値のバリデーション
function validateNumber(input, min, max) {
    let value = parseInt(input.value);
    if (isNaN(value)) {
        value = min;
    } else {
        value = Math.max(min, Math.min(max, value));
    }
    input.value = value;
    return value;
} 