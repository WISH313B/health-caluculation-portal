// BMIの判定基準（WHO基準）
const BMI_CATEGORIES = [
    { max: 18.5, category: "低体重", color: "#34C759", advice: "健康的な体重増加が推奨されます。", tips: [
        "栄養バランスの良い食事を心がけましょう",
        "適度な運動で筋肉をつけることを意識しましょう",
        "必要に応じて、医療専門家に相談することをお勧めします"
    ]},
    { max: 25, category: "普通体重", color: "#34C759", advice: "健康的な体重を維持できています。", tips: [
        "現在の生活習慣を継続しましょう",
        "定期的な運動を心がけましょう",
        "バランスの良い食事を続けましょう"
    ]},
    { max: 30, category: "肥満度1", color: "#FFD60A", advice: "軽度の肥満です。生活習慣の見直しを検討しましょう。", tips: [
        "適度な運動を始めましょう",
        "食事の量と質を見直しましょう",
        "規則正しい生活リズムを心がけましょう"
    ]},
    { max: 35, category: "肥満度2", color: "#FF9500", advice: "中等度の肥満です。生活習慣の改善が推奨されます。", tips: [
        "専門家に相談することをお勧めします",
        "毎日の運動を習慣化しましょう",
        "食事内容を記録して管理しましょう"
    ]},
    { max: 40, category: "肥満度3", color: "#FF3B30", advice: "高度の肥満です。医療機関への相談を推奨します。", tips: [
        "必ず医療機関を受診しましょう",
        "専門家の指導のもと運動を始めましょう",
        "食事療法について相談しましょう"
    ]},
    { max: Infinity, category: "肥満度4", color: "#FF2D55", advice: "極度の肥満です。至急、医療機関への相談が必要です。", tips: [
        "すぐに医療機関を受診しましょう",
        "専門家のサポートを受けましょう",
        "生活習慣の抜本的な見直しが必要です"
    ]}
];

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bmi-form');
    const resultSection = document.getElementById('result-section');
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');

    // 短縮URL生成関数
    function getShortUrl() {
        // 短縮URL形式で返す（実際のドメインに合わせて調整）
        const path = window.location.pathname;
        const fileName = path.split('/').pop().replace('.html', '');
        return `https://minna-no-kenko.com/${fileName}`;
    }

    let calculationResult = null;

    // フォーム送信イベント
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateBMI();
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
        calculationResult = null;
    });

    // Twitter共有ボタン
    shareButton.addEventListener('click', () => {
        if (calculationResult) {
            const currentUrl = getShortUrl();
            const tweetText = `身長${calculationResult.height}cm、体重${calculationResult.weight}kgの私のBMIは${calculationResult.bmi}（${calculationResult.category}）でした！\n#健康計算ポータル #BMI #健康管理\n\n${currentUrl}`;
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
            window.open(tweetUrl, '_blank');
        }
    });

    function calculateBMI() {
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);

        if (!height || !weight || height <= 0 || weight <= 0) {
            alert('正しい身長と体重を入力してください。');
            return;
        }

        // BMI計算
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        // BMI分類
        let category = '';
        let categoryClass = '';
        if (bmi < 18.5) {
            category = '低体重';
            categoryClass = 'underweight';
        } else if (bmi < 25) {
            category = '普通体重';
            categoryClass = 'normal';
        } else if (bmi < 30) {
            category = '肥満度1';
            categoryClass = 'overweight';
        } else if (bmi < 35) {
            category = '肥満度2';
            categoryClass = 'obesity';
        } else {
            category = '肥満度3以上';
            categoryClass = 'obesity';
        }

        // 適正体重範囲計算（BMI 18.5-25）
        const minWeight = 18.5 * heightInMeters * heightInMeters;
        const maxWeight = 24.9 * heightInMeters * heightInMeters;

        // 現在体重との差
        let weightDifference = '';
        if (weight < minWeight) {
            weightDifference = `+${(minWeight - weight).toFixed(1)}kg 増加が推奨`;
        } else if (weight > maxWeight) {
            weightDifference = `-${(weight - maxWeight).toFixed(1)}kg 減少が推奨`;
        } else {
            weightDifference = '適正範囲内';
        }

        // 結果表示
        document.getElementById('bmi-value').textContent = bmi.toFixed(1);
        document.getElementById('bmi-category').textContent = category;
        document.getElementById('weight-range-value').textContent = `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)}`;
        document.getElementById('weight-difference').textContent = weightDifference;

        // BMIマーカーの位置設定
        setBMIMarker(bmi);

        // 結果説明の更新
        const resultDescription = document.querySelector('.result-description');
        resultDescription.innerHTML = `BMI値：<span class="${categoryClass}">${category}</span>`;

        // 計算結果を保存
        calculationResult = {
            height: height,
            weight: weight,
            bmi: bmi.toFixed(1),
            category: category
        };
    }

    function setBMIMarker(bmi) {
        const marker = document.getElementById('bmi-marker');
        let position = 0;

        // BMI値に基づいてマーカーの位置を計算（パーセンテージ）
        if (bmi < 18.5) {
            position = (bmi / 18.5) * 20; // 0-20%
        } else if (bmi < 25) {
            position = 20 + ((bmi - 18.5) / (25 - 18.5)) * 30; // 20-50%
        } else if (bmi < 30) {
            position = 50 + ((bmi - 25) / (30 - 25)) * 25; // 50-75%
        } else if (bmi < 35) {
            position = 75 + ((bmi - 30) / (35 - 30)) * 15; // 75-90%
        } else {
            position = 90 + Math.min(((bmi - 35) / 10) * 10, 10); // 90-100%
        }

        // 最大100%に制限
        position = Math.min(position, 100);
        marker.style.left = `${position}%`;
    }
}); 