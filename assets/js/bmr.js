document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bmr-form');
    const resultSection = document.getElementById('result-section');
    const activityOptions = document.querySelectorAll('.activity-option');
    const activityLevelInput = document.getElementById('activity-level');
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');

    // 活動レベルの選択
    activityOptions.forEach(option => {
        option.addEventListener('click', () => {
            activityOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            activityLevelInput.value = option.dataset.value;
        });
    });

    // 初期選択
    activityOptions[0].classList.add('selected');

    // フォーム送信時の処理
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateAndDisplayResults();
    });

    // 再計算ボタンのクリック処理
    recalculateButton.addEventListener('click', () => {
        resultSection.style.display = 'none';
        form.reset();
        activityOptions.forEach(opt => opt.classList.remove('selected'));
        activityOptions[0].classList.add('selected');
        activityLevelInput.value = activityOptions[0].dataset.value;
    });

    // シェアボタンのクリック処理
    shareButton.addEventListener('click', () => {
        const bmr = document.getElementById('bmr-value').textContent;
        const tdee = document.getElementById('tdee-value').textContent;
        
        // 短縮URLを取得
        const currentUrl = getShortUrl();
        
        const tweetText = `私の基礎代謝量は${bmr}kcal、1日の消費カロリーは${tdee}kcalです！\n#基礎代謝 #健康計算ポータル\n\n${currentUrl}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(tweetUrl, '_blank');
    });

    // 短縮URL生成関数
    function getShortUrl() {
        const baseUrl = 'https://health-calc.jp';
        const currentPath = window.location.pathname;
        if (currentPath.includes('bmr')) {
            return `${baseUrl}/bmr`;
        }
        return baseUrl;
    }

    // BMRの計算（改訂版Harris-Benedict式）
    function calculateBMR(gender, weight, height, age) {
        if (gender === 'male') {
            return Math.round(13.397 * weight + 4.799 * height - 5.677 * age + 88.362);
        } else {
            return Math.round(9.247 * weight + 3.098 * height - 4.330 * age + 447.593);
        }
    }

    // 結果の計算と表示
    function calculateAndDisplayResults() {
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const age = parseFloat(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const activityLevel = parseFloat(activityLevelInput.value);

        // BMRの計算
        const bmr = calculateBMR(gender, weight, height, age);
        
        // TDEEの計算（1日の消費カロリー）
        const tdee = Math.round(bmr * activityLevel);

        // 目標カロリーの計算
        const weightLossCalories = Math.round(tdee - 500); // 1週間で0.5kg減量
        const maintenanceCalories = tdee;
        const weightGainCalories = Math.round(tdee + 500); // 1週間で0.5kg増量

        // 栄養素バランスの計算（現状維持カロリーベース）
        const protein = Math.round(weight * 2); // 体重1kgあたり2gのタンパク質
        const fat = Math.round((maintenanceCalories * 0.25) / 9); // カロリーの25%を脂質から（1g = 9kcal）
        const carbs = Math.round((maintenanceCalories - (protein * 4 + fat * 9)) / 4); // 残りを炭水化物（1g = 4kcal）

        // 結果の表示
        document.getElementById('bmr-value').textContent = bmr;
        document.getElementById('tdee-value').textContent = tdee;
        document.getElementById('weight-loss-value').textContent = weightLossCalories;
        document.getElementById('maintenance-value').textContent = maintenanceCalories;
        document.getElementById('weight-gain-value').textContent = weightGainCalories;
        document.getElementById('protein-value').textContent = protein;
        document.getElementById('fat-value').textContent = fat;
        document.getElementById('carbs-value').textContent = carbs;

        // 結果セクションの表示
        resultSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}); 