document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('body-fat-form');
    const resultSection = document.getElementById('result-section');
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');

    // 短縮URL生成関数
    function getShortUrl() {
        const baseUrl = 'https://health-calc.jp';
        const currentPath = window.location.pathname;
        if (currentPath.includes('body-fat')) {
            return `${baseUrl}/bodyfat`;
        }
        return baseUrl;
    }

    let calculationResult = null;

    // 性別選択で女性用ヒップ測定を表示/非表示
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const hipMeasurement = document.querySelector('.hip-measurement');

    genderInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.value === 'female') {
                hipMeasurement.style.display = 'block';
                document.getElementById('hip').required = true;
            } else {
                hipMeasurement.style.display = 'none';
                document.getElementById('hip').required = false;
            }
        });
    });

    // ツールチップ機能
    const helpButtons = document.querySelectorAll('.help-button');
    helpButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tooltip = button.getAttribute('data-tooltip');
            alert(tooltip);
        });
    });

    // フォーム送信イベント
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateBodyFat();
        resultSection.style.display = 'block';
        form.style.display = 'none';
        
        // ページの最上部までスムーズにスクロール
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    });

    // 再計算ボタン
    recalculateButton.addEventListener('click', () => {
        form.reset();
        resultSection.style.display = 'none';
        form.style.display = 'block';
        hipMeasurement.style.display = 'none';
        document.getElementById('hip').required = false;
        calculationResult = null;
    });

    // Twitter共有ボタン
    shareButton.addEventListener('click', () => {
        if (calculationResult) {
            const currentUrl = getShortUrl();
            const genderText = calculationResult.gender === 'male' ? '男性' : '女性';
            const tweetText = `${genderText}・${calculationResult.age}歳の私の体脂肪率は${calculationResult.bodyFat}%でした！（${calculationResult.category}）\n#健康計算ポータル #体脂肪率 #体組成\n\n${currentUrl}`;
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
            window.open(tweetUrl, '_blank');
        }
    });

    function calculateBodyFat() {
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const age = parseInt(document.getElementById('age').value);
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const waist = parseFloat(document.getElementById('waist').value);
        const neck = parseFloat(document.getElementById('neck').value);
        const hip = gender === 'female' ? parseFloat(document.getElementById('hip').value) : 0;

        // 入力値検証
        if (!age || !height || !weight || !waist || !neck || (gender === 'female' && !hip)) {
            alert('すべての項目を入力してください。');
            return;
        }

        // 米海軍式体脂肪率計算
        let bodyFatPercent;
        if (gender === 'male') {
            bodyFatPercent = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
        } else {
            bodyFatPercent = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
        }

        // 体脂肪量と除脂肪量の計算
        const fatMass = (weight * bodyFatPercent) / 100;
        const leanMass = weight - fatMass;

        // 体脂肪率の分類
        let category = '';
        let categoryClass = '';
        let idealRange = '';

        if (gender === 'male') {
            idealRange = '10～20%';
            if (bodyFatPercent < 8) {
                category = '低体脂肪';
                categoryClass = 'low';
            } else if (bodyFatPercent < 20) {
                category = '標準';
                categoryClass = 'normal';
            } else if (bodyFatPercent < 25) {
                category = 'やや高め';
                categoryClass = 'high';
            } else {
                category = '高体脂肪';
                categoryClass = 'very-high';
            }
        } else {
            idealRange = '20～30%';
            if (bodyFatPercent < 16) {
                category = '低体脂肪';
                categoryClass = 'low';
            } else if (bodyFatPercent < 30) {
                category = '標準';
                categoryClass = 'normal';
            } else if (bodyFatPercent < 35) {
                category = 'やや高め';
                categoryClass = 'high';
            } else {
                category = '高体脂肪';
                categoryClass = 'very-high';
            }
        }

        // 結果表示
        document.getElementById('body-fat-value').textContent = bodyFatPercent.toFixed(1);
        document.getElementById('body-fat-description').textContent = `${category}の範囲です。`;
        document.getElementById('fat-mass-value').textContent = fatMass.toFixed(1);
        document.getElementById('lean-mass-value').textContent = leanMass.toFixed(1);
        document.getElementById('ideal-range').textContent = idealRange;

        // 体組成バーの表示
        const fatPercentage = (fatMass / weight) * 100;
        const leanPercentage = (leanMass / weight) * 100;
        document.getElementById('fat-mass-bar').style.width = `${fatPercentage}%`;
        document.getElementById('lean-mass-bar').style.width = `${leanPercentage}%`;

        // 範囲マーカーの設定
        setRangeMarker(bodyFatPercent, gender);

        // 計算結果を保存
        calculationResult = {
            gender: gender,
            age: age,
            bodyFat: bodyFatPercent.toFixed(1),
            category: category
        };
    }

    function setRangeMarker(bodyFatPercent, gender) {
        const marker = document.getElementById('range-marker');
        let position = 0;

        if (gender === 'male') {
            // 男性の場合: 8%未満(低)、8-20%(標準)、20-25%(やや高め)、25%以上(高)
            if (bodyFatPercent < 8) {
                position = (bodyFatPercent / 8) * 15; // 0-15%
            } else if (bodyFatPercent < 20) {
                position = 15 + ((bodyFatPercent - 8) / 12) * 50; // 15-65%
            } else if (bodyFatPercent < 25) {
                position = 65 + ((bodyFatPercent - 20) / 5) * 20; // 65-85%
            } else {
                position = 85 + Math.min(((bodyFatPercent - 25) / 10) * 15, 15); // 85-100%
            }
        } else {
            // 女性の場合: 16%未満(低)、16-30%(標準)、30-35%(やや高め)、35%以上(高)
            if (bodyFatPercent < 16) {
                position = (bodyFatPercent / 16) * 15; // 0-15%
            } else if (bodyFatPercent < 30) {
                position = 15 + ((bodyFatPercent - 16) / 14) * 50; // 15-65%
            } else if (bodyFatPercent < 35) {
                position = 65 + ((bodyFatPercent - 30) / 5) * 20; // 65-85%
            } else {
                position = 85 + Math.min(((bodyFatPercent - 35) / 10) * 15, 15); // 85-100%
            }
        }

        position = Math.min(position, 100);
        marker.style.left = `${position}%`;
    }
}); 