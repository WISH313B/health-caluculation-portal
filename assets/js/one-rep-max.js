// 利用可能なプレート（kg）
const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];

// 強度とレップ数の対応表
const intensityReps = [
    { intensity: 100, reps: '1' },
    { intensity: 95, reps: '2-3' },
    { intensity: 90, reps: '4-5' },
    { intensity: 85, reps: '6-7' },
    { intensity: 80, reps: '8-10' },
    { intensity: 75, reps: '10-12' },
    { intensity: 70, reps: '12-15' },
    { intensity: 65, reps: '15-20' }
];

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', () => {
    // 入力要素の取得
    const form = document.getElementById('one-rm-form');
    const resultSection = document.getElementById('result-section');
    const weightInput = document.getElementById('weight');
    const repsInput = document.getElementById('reps');
    const formulaSelect = document.getElementById('formula');
    const targetWeightInput = document.getElementById('targetWeight');
    const barWeightInput = document.getElementById('barWeight');
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');

    // 短縮URL生成関数
    function getShortUrl() {
        const baseUrl = 'https://health-calc.jp';
        const currentPath = window.location.pathname;
        if (currentPath.includes('one-rep-max')) {
            return `${baseUrl}/1rm`;
        }
        return baseUrl;
    }

    // フォーム送信の処理
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateOneRepMax();
        resultSection.style.display = 'block';
        form.style.display = 'none';
        
        // ページの最上部までスムーズにスクロール
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    });

    // イベントリスナーの設定（リアルタイム計算用）
    [weightInput, repsInput, formulaSelect].forEach(input => {
        input.addEventListener('input', () => {
            if (resultSection.style.display === 'block') {
                calculateOneRepMax();
            }
        });
    });

    [targetWeightInput, barWeightInput].forEach(input => {
        input.addEventListener('input', () => {
            if (resultSection.style.display === 'block') {
                calculatePlates();
            }
        });
    });

    // 再計算ボタンのクリック処理
    recalculateButton.addEventListener('click', () => {
        // 入力値をリセット
        weightInput.value = '';
        repsInput.value = '';
        formulaSelect.selectedIndex = 0;
        targetWeightInput.value = '';
        barWeightInput.value = '20';
        
        // セクションの表示切り替え
        resultSection.style.display = 'none';
        form.style.display = 'block';
    });

    // シェアボタンのクリック処理
    shareButton.addEventListener('click', () => {
        const weight = weightInput.value || '80';
        const reps = repsInput.value || '5';
        const oneRM = document.getElementById('oneRepMax').textContent;
        const formula = formulaSelect.options[formulaSelect.selectedIndex].text;
        
        // 短縮URLを取得
        const currentUrl = getShortUrl();
        
        const tweetText = `${weight}kg×${reps}回の私の推定1RMは${oneRM}kgでした！（${formula}で計算）\n#健康計算ポータル #1RM #筋トレ\n\n${currentUrl}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(tweetUrl, '_blank');
    });
});

// 1RMの計算
function calculateOneRepMax() {
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const reps = parseInt(document.getElementById('reps').value) || 1;
    const formula = document.getElementById('formula').value;

    let oneRepMax = 0;

    // 各計算式による1RMの計算
    switch (formula) {
        case 'brzycki':
            oneRepMax = weight * (36 / (37 - reps));
            break;
        case 'epley':
            oneRepMax = weight * (1 + 0.0333 * reps);
            break;
        case 'lander':
            oneRepMax = (100 * weight) / (101.3 - 2.67123 * reps);
            break;
        case 'lombardi':
            oneRepMax = weight * Math.pow(reps, 0.1);
            break;
    }

    // 結果の表示
    document.getElementById('oneRepMax').textContent = Math.round(oneRepMax * 10) / 10;

    // トレーニング強度表の更新
    updateIntensityTable(oneRepMax);

    // プレート計算機の目標重量を更新
    document.getElementById('targetWeight').value = Math.round(oneRepMax * 10) / 10;
    calculatePlates();
}

// トレーニング強度表の更新
function updateIntensityTable(oneRepMax) {
    const tableBody = document.getElementById('intensityTable');
    tableBody.innerHTML = '';

    intensityReps.forEach(({ intensity, reps }) => {
        const weight = (oneRepMax * intensity / 100);
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <span>${intensity}%</span>
            <span>${Math.round(weight * 10) / 10}kg</span>
            <span>${reps}</span>
        `;
        tableBody.appendChild(row);
    });
}

// プレートの計算
function calculatePlates() {
    const targetWeight = parseFloat(document.getElementById('targetWeight').value) || 0;
    const barWeight = parseFloat(document.getElementById('barWeight').value) || 20;

    // バーベルの重量を超えているか確認
    if (targetWeight < barWeight) {
        displayPlateResult([], '目標重量がバーの重量より軽いです');
        return;
    }

    // 片側に必要な重量を計算
    const weightPerSide = (targetWeight - barWeight) / 2;

    // プレートの組み合わせを計算
    const plates = calculatePlateConfiguration(weightPerSide);

    if (plates === null) {
        displayPlateResult([], '指定の重量は現在の設定では実現できません');
        return;
    }

    displayPlateResult(plates);
}

// プレートの組み合わせを計算
function calculatePlateConfiguration(targetWeight) {
    const plates = [];
    let remainingWeight = targetWeight;

    // 大きい重量から順に試す
    for (const plate of availablePlates) {
        while (remainingWeight >= plate) {
            plates.push(plate);
            remainingWeight -= plate;
        }
    }

    // 0.1kg未満の誤差は許容
    if (remainingWeight > 0.1) {
        return null;
    }

    return plates;
}

// プレート計算結果の表示
function displayPlateResult(plates, errorMessage = '') {
    const visualization = document.getElementById('plateVisualization');
    const plateList = document.getElementById('plateList');

    if (errorMessage) {
        visualization.innerHTML = `<p class="error-message">${errorMessage}</p>`;
        plateList.innerHTML = '';
        return;
    }

    // プレートの視覚化
    visualization.innerHTML = plates.map(plate => 
        `<div class="plate plate-${plate.toString().replace('.', '-')}">${plate}</div>`
    ).join('');

    // プレートのリスト表示
    const plateCounts = plates.reduce((acc, plate) => {
        acc[plate] = (acc[plate] || 0) + 1;
        return acc;
    }, {});

    plateList.innerHTML = Object.entries(plateCounts)
        .map(([plate, count]) => `
            <div class="plate-item">
                <span>${plate}kg</span>
                <span>×</span>
                <span>${count}</span>
            </div>
        `).join('');
} 