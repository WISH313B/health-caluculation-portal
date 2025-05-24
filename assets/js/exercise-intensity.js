// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', () => {
    // 入力要素の取得
    const form = document.getElementById('exercise-form');
    const resultSection = document.getElementById('result-section');
    const weightInput = document.getElementById('weight');
    const durationInput = document.getElementById('duration');
    const activitySelect = document.getElementById('activity');
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');

    // 短縮URL生成関数
    function getShortUrl() {
        const baseUrl = 'https://health-calc.jp';
        const currentPath = window.location.pathname;
        if (currentPath.includes('exercise-intensity')) {
            return `${baseUrl}/exercise`;
        }
        return baseUrl;
    }

    // フォーム送信の処理
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateExerciseIntensity();
        resultSection.style.display = 'block';
        form.style.display = 'none';
        
        // ページの最上部までスムーズにスクロール
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    });

    // イベントリスナーの設定（リアルタイム計算用）
    [weightInput, durationInput, activitySelect].forEach(input => {
        input.addEventListener('input', () => {
            if (resultSection.style.display === 'block') {
                calculateExerciseIntensity();
            }
        });
    });

    // 再計算ボタンのクリック処理
    recalculateButton.addEventListener('click', () => {
        // 入力値をリセット
        weightInput.value = '';
        durationInput.value = '';
        activitySelect.selectedIndex = 0;
        
        // セクションの表示切り替え
        resultSection.style.display = 'none';
        form.style.display = 'block';
    });

    // シェアボタンのクリック処理
    shareButton.addEventListener('click', () => {
        const mets = document.getElementById('metsValue').textContent;
        const calories = document.getElementById('calorieValue').textContent;
        const activity = activitySelect.options[activitySelect.selectedIndex].text;
        const duration = durationInput.value || '30';
        
        // 短縮URLを取得
        const currentUrl = getShortUrl();
        
        const tweetText = `${activity}を${duration}分行った結果：運動強度${mets}METs、消費カロリー${calories}kcal！\n#健康計算ポータル #運動強度\n\n${currentUrl}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(tweetUrl, '_blank');
    });
});

// 運動強度と消費カロリーの計算
function calculateExerciseIntensity() {
    const weight = parseFloat(document.getElementById('weight').value) || 60;
    const duration = parseFloat(document.getElementById('duration').value) || 30;
    const mets = parseFloat(document.getElementById('activity').value) || 0;

    // METs値の表示
    document.getElementById('metsValue').textContent = mets.toFixed(1);

    // 消費カロリーの計算（kcal = METs × 体重kg × 時間h × 1.05）
    const hours = duration / 60;
    const calories = mets * weight * hours * 1.05;
    document.getElementById('calorieValue').textContent = Math.round(calories);

    // 運動強度レベルの視覚的フィードバック
    updateIntensityHighlight(mets);
}

// 運動強度レベルのハイライト表示
function updateIntensityHighlight(mets) {
    // すべてのカードから強調表示を削除
    document.querySelectorAll('.intensity-card').forEach(card => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
    });

    // 現在の強度レベルに該当するカードを強調表示
    let targetCard;
    if (mets <= 2) {
        targetCard = document.querySelector('[data-intensity="very-light"]');
    } else if (mets <= 3) {
        targetCard = document.querySelector('[data-intensity="light"]');
    } else if (mets <= 6) {
        targetCard = document.querySelector('[data-intensity="moderate"]');
    } else if (mets <= 8) {
        targetCard = document.querySelector('[data-intensity="vigorous"]');
    } else {
        targetCard = document.querySelector('[data-intensity="very-vigorous"]');
    }

    if (targetCard) {
        targetCard.style.transform = 'translateY(-4px)';
        targetCard.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    }
}

// 数値のバリデーション
function validateNumber(input, min, max) {
    let value = parseFloat(input.value);
    if (isNaN(value)) {
        value = min;
    } else {
        value = Math.max(min, Math.min(max, value));
    }
    input.value = value;
    return value;
}

// 入力値の検証
document.getElementById('weight').addEventListener('change', function() {
    validateNumber(this, 30, 200);
    calculateExerciseIntensity();
});

document.getElementById('duration').addEventListener('change', function() {
    validateNumber(this, 1, 480);
    calculateExerciseIntensity();
}); 