document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ideal-weight-form');
    const resultSection = document.getElementById('result-section');
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');

    // 短縮URL生成関数
    function getShortUrl() {
        // 実際のサイトのURL構造に合わせて生成
        const path = window.location.pathname;
        const fileName = path.split('/').pop().replace('.html', '');
        return `https://minna-no-kenko.com/calculators/pages/${fileName}`;
    }

    // BMI判定基準
    const BMI_CATEGORIES = {
        SEVERELY_UNDERWEIGHT: { max: 16.0, label: '重度の低体重', risk: '高', color: '#FF3B30' },
        UNDERWEIGHT: { max: 18.5, label: '低体重', risk: '中', color: '#FF9500' },
        NORMAL: { max: 25.0, label: '標準', risk: '低', color: '#34C759' },
        OVERWEIGHT: { max: 30.0, label: '肥満（1度）', risk: '中', color: '#FF9500' },
        OBESE: { max: 35.0, label: '肥満（2度）', risk: '高', color: '#FF3B30' },
        SEVERELY_OBESE: { max: Infinity, label: '肥満（3度）', risk: '極めて高', color: '#FF2D55' }
    };

    // 体格による補正係数
    const FRAME_SIZE_FACTORS = {
        small: 0.9,
        medium: 1.0,
        large: 1.1
    };

    function calculateBMI(weight, height) {
        return weight / Math.pow(height / 100, 2);
    }

    function getBMICategory(bmi) {
        for (const [category, data] of Object.entries(BMI_CATEGORIES)) {
            if (bmi <= data.max) {
                return { category, ...data };
            }
        }
        return BMI_CATEGORIES.SEVERELY_OBESE;
    }

    function calculateIdealWeight(height, frameSize) {
        // 標準体重（ブローカー指数）をベースに体格で補正
        const baseIdealWeight = (height - 100) * 0.9;
        return baseIdealWeight * FRAME_SIZE_FACTORS[frameSize];
    }

    function getWeightRange(idealWeight) {
        const range = {
            min: idealWeight * 0.9,
            max: idealWeight * 1.1
        };
        return range;
    }

    function updateResults(formData) {
        const height = parseFloat(formData.get('height'));
        const weight = parseFloat(formData.get('weight'));
        const frameSize = formData.get('frame-size');
        const gender = formData.get('gender');
        const age = parseInt(formData.get('age'));

        // BMI計算と判定
        const bmi = calculateBMI(weight, height);
        const bmiCategory = getBMICategory(bmi);
        
        // 適正体重計算
        const idealWeight = calculateIdealWeight(height, frameSize);
        const weightRange = getWeightRange(idealWeight);
        const weightDifference = weight - idealWeight;

        // 結果の更新
        document.getElementById('bmi-value').textContent = bmi.toFixed(1);
        document.getElementById('bmi-category').textContent = bmiCategory.label;
        document.getElementById('bmi-category').style.color = bmiCategory.color;

        document.getElementById('ideal-weight-value').textContent = idealWeight.toFixed(1);
        document.getElementById('weight-range-min').textContent = weightRange.min.toFixed(1);
        document.getElementById('weight-range-max').textContent = weightRange.max.toFixed(1);

        document.getElementById('weight-difference').textContent = Math.abs(weightDifference).toFixed(1);
        const differenceLabel = document.getElementById('difference-label');
        differenceLabel.textContent = weightDifference > 0 ? '減量が推奨' : weightDifference < 0 ? '増量が推奨' : '適正体重です';

        // マーカーの位置更新
        updateWeightMarkers(weight, idealWeight, weightRange);

        // 健康リスクと推奨事項の更新
        updateHealthRisks(bmiCategory, age, gender);
        updateRecommendations(weightDifference, bmiCategory, age);
    }

    function updateWeightMarkers(currentWeight, idealWeight, weightRange) {
        const scale = document.querySelector('.weight-scale');
        const scaleWidth = scale.offsetWidth;
        const range = weightRange.max - weightRange.min;
        
        const currentMarker = document.getElementById('current-weight-marker');
        const idealMarker = document.getElementById('ideal-weight-marker');

        // マーカーの位置を計算（スケール内に収まるように調整）
        const getCurrentPosition = () => {
            const pos = ((currentWeight - weightRange.min) / range) * 100;
            return Math.max(0, Math.min(100, pos));
        };

        const getIdealPosition = () => {
            const pos = ((idealWeight - weightRange.min) / range) * 100;
            return Math.max(0, Math.min(100, pos));
        };

        currentMarker.style.left = `${getCurrentPosition()}%`;
        idealMarker.style.left = `${getIdealPosition()}%`;
    }

    function updateHealthRisks(bmiCategory, age, gender) {
        const riskLevel = document.getElementById('risk-level');
        const riskDetails = document.getElementById('risk-details');
        
        // リスクレベルの表示更新
        riskLevel.querySelector('span').textContent = `健康リスク: ${bmiCategory.risk}`;
        riskLevel.style.backgroundColor = bmiCategory.color + '20'; // 20% opacity

        // リスク詳細の更新
        const risks = [];
        if (bmiCategory.category === 'SEVERELY_UNDERWEIGHT' || bmiCategory.category === 'UNDERWEIGHT') {
            risks.push('免疫力の低下のリスク');
            risks.push('骨密度低下のリスク');
            if (gender === 'female') {
                risks.push('生理不順や不妊のリスク');
            }
        } else if (bmiCategory.category === 'OVERWEIGHT' || bmiCategory.category === 'OBESE' || bmiCategory.category === 'SEVERELY_OBESE') {
            risks.push('糖尿病のリスク');
            risks.push('高血圧のリスク');
            risks.push('心臓病のリスク');
            if (age > 40) {
                risks.push('関節への負担増加');
            }
        }

        riskDetails.innerHTML = risks.map(risk => `<li>${risk}</li>`).join('');
    }

    function updateRecommendations(weightDifference, bmiCategory, age) {
        const goalRecommendations = document.getElementById('goal-recommendations');
        const practicalTips = document.getElementById('practical-tips');

        const goals = [];
        const tips = [];

        if (weightDifference > 0) {
            // 減量が必要な場合
            const weeklyGoal = Math.min(1.0, weightDifference * 0.1);
            goals.push(`週${weeklyGoal.toFixed(1)}kgのペースでの減量`);
            goals.push(`3ヶ月で${Math.min(12, weightDifference).toFixed(1)}kgの減量`);

            tips.push('1日3食規則正しい食事を心がける');
            tips.push('間食を控えめにする');
            tips.push('有酸素運動を週3回以上行う');
            if (age > 40) {
                tips.push('急激な運動は避け、ウォーキングから始める');
            }
        } else if (weightDifference < 0) {
            // 増量が必要な場合
            const weeklyGoal = Math.min(0.5, Math.abs(weightDifference) * 0.1);
            goals.push(`週${weeklyGoal.toFixed(1)}kgのペースでの増量`);
            goals.push(`3ヶ月で${Math.min(6, Math.abs(weightDifference)).toFixed(1)}kgの増量`);

            tips.push('タンパク質を十分に摂取する');
            tips.push('適度な筋力トレーニングを行う');
            tips.push('食事の回数を増やす');
        } else {
            // 適正体重の場合
            goals.push('現在の体重の維持');
            tips.push('バランスの良い食事を継続');
            tips.push('定期的な運動習慣を維持');
        }

        goalRecommendations.innerHTML = goals.map(goal => `<li>${goal}</li>`).join('');
        practicalTips.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        updateResults(formData);
        resultSection.style.display = 'block';
        form.style.display = 'none';
        
        // ページの最上部までスムーズにスクロール
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    });

    recalculateButton.addEventListener('click', () => {
        resultSection.style.display = 'none';
        form.style.display = 'block';
    });

    shareButton.addEventListener('click', () => {
        const bmi = document.getElementById('bmi-value').textContent;
        const category = document.getElementById('bmi-category').textContent;
        const idealWeight = document.getElementById('ideal-weight-value').textContent;
        
        // 現在のページのURLを取得
        const currentUrl = getShortUrl();
        
        const tweetText = `私のBMIは${bmi}で${category}です。適正体重は${idealWeight}kgです。\n#健康計算ポータル #適正体重\n\n${currentUrl}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(tweetUrl, '_blank');
    });
}); 