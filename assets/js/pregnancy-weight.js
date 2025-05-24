document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const preHeight = document.getElementById('preHeight');
    const preWeight = document.getElementById('preWeight');
    const currentWeek = document.getElementById('currentWeek');
    const currentDay = document.getElementById('currentDay');
    const currentWeight = document.getElementById('currentWeight');

    // 入力値の変更イベント
    [preHeight, preWeight, currentWeek, currentDay, currentWeight].forEach(input => {
        input.addEventListener('input', calculateAll);
    });

    // グラフの初期化
    let weightChart = null;
    initializeChart();

    // 初期計算
    calculateAll();
});

// BMIの計算
function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

// BMIカテゴリーの判定
function getBMICategory(bmi) {
    if (bmi < 18.5) return '低体重';
    if (bmi < 25) return '普通体重';
    return '肥満';
}

// 推奨体重増加量の計算
function getRecommendedGain(bmi) {
    if (bmi < 18.5) return { min: 9, max: 12 };
    if (bmi < 25) return { min: 7, max: 12 };
    return { min: 0, max: 0 }; // 肥満の場合は個別対応
}

// 週数に応じた推奨増加量の計算
function getWeeklyRecommendedGain(bmi, week) {
    const total = getRecommendedGain(bmi);
    
    // 12週までは体重増加が少ない
    if (week <= 12) {
        return {
            min: total.min * (week / 40) * 0.5,
            max: total.max * (week / 40) * 0.5
        };
    }
    
    // 13週以降は残りの増加量を週数で按分
    const remainingWeeks = 40 - 12;
    const currentWeeks = week - 12;
    const baseGain = {
        min: total.min * (12 / 40) * 0.5,
        max: total.max * (12 / 40) * 0.5
    };
    
    return {
        min: baseGain.min + (total.min - baseGain.min) * (currentWeeks / remainingWeeks),
        max: baseGain.max + (total.max - baseGain.max) * (currentWeeks / remainingWeeks)
    };
}

// 全ての計算を実行
function calculateAll() {
    const height = parseFloat(preHeight.value) || 0;
    const weight = parseFloat(preWeight.value) || 0;
    const weeks = parseInt(currentWeek.value) || 0;
    const days = parseInt(currentDay.value) || 0;
    const current = parseFloat(currentWeight.value) || 0;

    if (height === 0 || weight === 0) return;

    // BMIの計算と表示
    const bmi = calculateBMI(weight, height);
    document.getElementById('preBmi').textContent = bmi.toFixed(1);
    document.getElementById('bmiCategory').textContent = getBMICategory(bmi);

    // 推奨総増加量の計算と表示
    const recommendedTotal = getRecommendedGain(bmi);
    if (recommendedTotal.min === 0 && recommendedTotal.max === 0) {
        document.getElementById('recommendedTotalGain').textContent = '個別対応';
    } else {
        document.getElementById('recommendedTotalGain').textContent = 
            `${recommendedTotal.min}kg - ${recommendedTotal.max}kg`;
    }

    // 現在の増加量の計算と表示
    const gain = current - weight;
    document.getElementById('currentGain').textContent = `${gain.toFixed(1)}kg`;

    // 現在の推奨範囲の計算と表示
    if (weeks > 0) {
        const weeklyGain = getWeeklyRecommendedGain(bmi, weeks + days/7);
        document.getElementById('currentRange').textContent = 
            `${weeklyGain.min.toFixed(1)}kg - ${weeklyGain.max.toFixed(1)}kg`;

        // 進捗バーの更新
        updateProgressBar(gain, weeklyGain.min, weeklyGain.max);
    } else {
        document.getElementById('currentRange').textContent = '-';
        document.getElementById('progressBar').style.width = '0%';
    }

    // グラフの更新
    updateChart(bmi, weeks + days/7, gain);
}

// 進捗バーの更新
function updateProgressBar(gain, min, max) {
    const progressBar = document.getElementById('progressBar');
    const progressStatus = document.getElementById('progressStatus');
    
    // 進捗率の計算
    let percentage;
    let status;
    let className;
    
    if (gain < min) {
        percentage = (gain / min) * 100;
        status = '推奨範囲未満';
        className = 'under';
    } else if (gain > max) {
        percentage = 100;
        status = '推奨範囲超過';
        className = 'over';
    } else {
        percentage = ((gain - min) / (max - min)) * 100;
        status = '推奨範囲内';
        className = 'normal';
    }

    progressBar.style.width = `${Math.min(100, percentage)}%`;
    progressBar.className = `progress ${className}`;
    progressStatus.textContent = status;
}

// グラフの初期化
function initializeChart() {
    const ctx = document.getElementById('weightChart').getContext('2d');
    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 41}, (_, i) => `${i}週`),
            datasets: [
                {
                    label: '推奨下限',
                    borderColor: '#FFB74D',
                    borderDash: [5, 5],
                    fill: false,
                    data: []
                },
                {
                    label: '推奨上限',
                    borderColor: '#FFB74D',
                    borderDash: [5, 5],
                    fill: '-1',
                    backgroundColor: 'rgba(255, 183, 77, 0.1)',
                    data: []
                },
                {
                    label: '実際の体重増加',
                    borderColor: '#4CAF50',
                    borderWidth: 2,
                    pointRadius: 4,
                    fill: false,
                    data: []
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '体重増加量 (kg)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

// グラフの更新
function updateChart(bmi, currentWeek, currentGain) {
    const minData = [];
    const maxData = [];
    const actualData = Array(41).fill(null);

    // 推奨範囲のラインを計算
    for (let week = 0; week <= 40; week++) {
        const gain = getWeeklyRecommendedGain(bmi, week);
        minData.push(gain.min);
        maxData.push(gain.max);
    }

    // 現在の体重増加をプロット
    if (currentWeek >= 0 && currentWeek <= 40) {
        actualData[Math.floor(currentWeek)] = currentGain;
    }

    weightChart.data.datasets[0].data = minData;
    weightChart.data.datasets[1].data = maxData;
    weightChart.data.datasets[2].data = actualData;
    weightChart.update();
}

// 数値の検証
function validateNumber(input, min, max) {
    let value = parseFloat(input.value);
    if (isNaN(value)) {
        value = 0;
    } else {
        value = Math.max(min, Math.min(max, value));
    }
    input.value = value;
    return value;
}

// 入力値の検証
document.getElementById('preHeight').addEventListener('change', function() {
    validateNumber(this, 120, 200);
    calculateAll();
});

document.getElementById('preWeight').addEventListener('change', function() {
    validateNumber(this, 30, 150);
    calculateAll();
});

document.getElementById('currentWeight').addEventListener('change', function() {
    validateNumber(this, 30, 150);
    calculateAll();
});

document.getElementById('currentWeek').addEventListener('change', function() {
    validateNumber(this, 0, 42);
    calculateAll();
});

document.getElementById('currentDay').addEventListener('change', function() {
    validateNumber(this, 0, 6);
    calculateAll();
}); 