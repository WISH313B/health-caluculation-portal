document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tdee-form');
    const resultSection = document.getElementById('result-section');
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');
    const bmrInput = document.getElementById('bmr');
    let calorieChart = null;

    // 活動レベルの説明
    const PAL_DESCRIPTIONS = {
        '1.2': '座り仕事中心（デスクワークが多く、運動習慣がない）',
        '1.375': '軽い活動（立ち仕事や軽い運動を週1-3回）',
        '1.55': '中程度の活動（運動を週3-5回）',
        '1.725': '活発な活動（激しい運動を週6-7回）',
        '1.9': '非常に活発（アスリートレベルの運動や肉体労働）'
    };

    function calculateTDEE(bmr, activityLevel) {
        return Math.round(bmr * activityLevel);
    }

    function calculateCalorieGoals(tdee) {
        return {
            weightLoss: Math.round(tdee * 0.8),    // 減量（-20%）
            maintenance: tdee,                      // 維持
            weightGain: Math.round(tdee * 1.2)     // 増量（+20%）
        };
    }

    function updateChart(bmr, activityCalories) {
        const ctx = document.getElementById('calorie-chart').getContext('2d');
        
        if (calorieChart) {
            calorieChart.destroy();
        }

        calorieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['基礎代謝（BMR）', '活動による消費'],
                datasets: [{
                    data: [bmr, activityCalories],
                    backgroundColor: [
                        '#007AFF',
                        '#34C759'
                    ],
                    borderColor: [
                        '#ffffff',
                        '#ffffff'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 14
                            },
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    function updateResults(bmr, activityLevel) {
        const tdee = calculateTDEE(bmr, activityLevel);
        const goals = calculateCalorieGoals(tdee);
        const activityCalories = tdee - bmr;

        // 結果の更新
        document.getElementById('tdee-value').textContent = tdee;
        document.getElementById('weight-loss-calories').textContent = goals.weightLoss;
        document.getElementById('maintenance-calories').textContent = goals.maintenance;
        document.getElementById('weight-gain-calories').textContent = goals.weightGain;

        // グラフの更新
        updateChart(bmr, activityCalories);

        // 結果セクションの表示
        resultSection.style.display = 'block';
        form.style.display = 'none';
        
        // ページの最上部までスムーズにスクロール
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }

    // BMR値の自動入力処理
    function handleBMRAutoFill() {
        const urlParams = new URLSearchParams(window.location.search);
        const bmrParam = urlParams.get('bmr');
        if (bmrParam) {
            bmrInput.value = bmrParam;
            // BMRが設定されたことを視覚的に示す
            bmrInput.classList.add('autofilled');
            // ツールチップを表示
            showTooltip('BMR計算機から値が自動入力されました');
        }
    }

    function showTooltip(message) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = message;
        bmrInput.parentElement.appendChild(tooltip);

        // 3秒後にツールチップを消す
        setTimeout(() => {
            tooltip.remove();
        }, 3000);
    }

    // BMR計算機へのリンクの動的な更新
    function updateBMRLink() {
        const calculateBMRLink = document.querySelector('.calculate-bmr-link');
        const currentBMR = bmrInput.value;
        
        if (currentBMR) {
            calculateBMRLink.href = `bmr.html?current_bmr=${currentBMR}`;
        }
    }

    // BMR入力値の検証
    function validateBMRInput(value) {
        const bmr = parseInt(value);
        if (isNaN(bmr) || bmr < 500 || bmr > 5000) {
            return false;
        }
        return true;
    }

    // イベントリスナーの設定
    bmrInput.addEventListener('input', () => {
        if (validateBMRInput(bmrInput.value)) {
            bmrInput.classList.remove('invalid');
            updateBMRLink();
        } else {
            bmrInput.classList.add('invalid');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const bmr = parseInt(formData.get('bmr'));
        const activityLevel = parseFloat(formData.get('activity-level'));
        
        if (!validateBMRInput(bmr)) {
            showTooltip('BMRは500から5000の間で入力してください');
            return;
        }
        
        updateResults(bmr, activityLevel);
    });

    recalculateButton.addEventListener('click', () => {
        resultSection.style.display = 'none';
        form.style.display = 'block';
    });

    // 短縮URL生成関数
    function getShortUrl() {
        // 実際のサイトのURL構造に合わせて生成
        const path = window.location.pathname;
        const fileName = path.split('/').pop().replace('.html', '');
        return `https://minna-no-kenko.com/calculators/pages/${fileName}`;
    }

    shareButton.addEventListener('click', () => {
        const tdee = document.getElementById('tdee-value').textContent;
        const activityLevel = document.querySelector('input[name="activity-level"]:checked').value;
        const activityDescription = PAL_DESCRIPTIONS[activityLevel];
        
        // 現在のページのURLを取得
        const currentUrl = getShortUrl();
        
        const tweetText = `私の1日の消費カロリーは${tdee}kcalです。\n活動レベル：${activityDescription}\n#健康計算ポータル #TDEE\n\n${currentUrl}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(tweetUrl, '_blank');
    });

    // 初期化時の処理
    handleBMRAutoFill();
}); 