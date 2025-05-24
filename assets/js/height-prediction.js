// 年齢別の平均身長と標準偏差データ
const heightData = {
    male: {
        mean: [
            51.6, 75.7, 86.6, 95.0, 101.9, // 0-4歳
            108.4, 114.4, 120.4, 125.9, 131.1, // 5-9歳
            136.1, 141.6, 147.5, 153.8, 159.7, // 10-14歳
            165.0, 168.8, 170.7, 171.5, 171.8, // 15-19歳
            172.0, 172.0, 172.0, 172.0, 172.0  // 20-24歳
        ],
        sd: [
            2.5, 2.8, 3.4, 3.9, 4.2, // 0-4歳
            4.5, 4.8, 5.1, 5.4, 5.7, // 5-9歳
            6.0, 6.4, 6.8, 7.0, 7.0, // 10-14歳
            6.8, 6.5, 6.2, 6.0, 5.8, // 15-19歳
            5.8, 5.8, 5.8, 5.8, 5.8  // 20-24歳
        ]
    },
    female: {
        mean: [
            50.9, 74.1, 85.4, 94.0, 100.9, // 0-4歳
            107.2, 113.3, 119.2, 124.8, 130.2, // 5-9歳
            136.1, 142.5, 148.0, 152.3, 155.2, // 10-14歳
            157.2, 158.2, 158.7, 158.8, 158.8, // 15-19歳
            158.8, 158.8, 158.8, 158.8, 158.8  // 20-24歳
        ],
        sd: [
            2.4, 2.7, 3.3, 3.8, 4.1, // 0-4歳
            4.4, 4.7, 5.0, 5.3, 5.6, // 5-9歳
            5.9, 6.3, 6.5, 6.3, 6.0, // 10-14歳
            5.7, 5.5, 5.3, 5.3, 5.3, // 15-19歳
            5.3, 5.3, 5.3, 5.3, 5.3  // 20-24歳
        ]
    }
};

// 豆知識データ
const triviaData = [
    "身長は遺伝的要因が約60-80%、環境要因が約20-40%と言われています。",
    "成長期の十分な睡眠と栄養バランスの良い食事は、健全な身長の成長に重要です。",
    "運動、特に縄跳びやバスケットボールなどの垂直方向の動きを含む運動は、成長を促進する可能性があります。",
    "成長ホルモンは夜間の深い睡眠中に最も多く分泌されます。",
    "日本人の平均身長は、この100年間で約10cm以上増加しています。"
];

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const resultSection = document.getElementById('result-section');
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');

    // 短縮URL生成関数
    function getShortUrl() {
        const baseUrl = 'https://health-calc.jp';
        const currentPath = window.location.pathname;
        if (currentPath.includes('height-prediction')) {
            return `${baseUrl}/height`;
        }
        return baseUrl;
    }

    let calculationResult = null;
    let chart = null;

    // フォーム送信イベント
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateHeight();
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
        if (chart) {
            chart.destroy();
            chart = null;
        }
    });

    // Twitter共有ボタン
    shareButton.addEventListener('click', () => {
        if (calculationResult) {
            const currentUrl = getShortUrl();
            const genderText = calculationResult.gender === 'male' ? '男性' : '女性';
            const tweetText = `${genderText}・${calculationResult.age}歳の予測身長は${calculationResult.predictedHeight}cmでした！\n現在の身長から${calculationResult.growthPotential}cm成長予定です\n#健康計算ポータル #身長予測 #成長\n\n${currentUrl}`;
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
            window.open(tweetUrl, '_blank');
        }
    });

    function calculateHeight() {
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const age = parseInt(document.getElementById('age').value);
        const currentHeight = parseFloat(document.getElementById('current-height').value);
        const fatherHeight = parseFloat(document.getElementById('father-height').value);
        const motherHeight = parseFloat(document.getElementById('mother-height').value);

        // 入力値検証
        if (!age || !currentHeight || !fatherHeight || !motherHeight) {
            alert('すべての項目を入力してください。');
            return;
        }

        // 両親の平均身長計算
        const parentsAverage = ((fatherHeight + motherHeight) / 2);

        // 遺伝的予測身長計算
        let geneticPrediction;
        if (gender === 'male') {
            geneticPrediction = (fatherHeight + motherHeight + 13) / 2;
        } else {
            geneticPrediction = (fatherHeight + motherHeight - 13) / 2;
        }

        // 成長曲線による予測
        const adultAge = 18;
        let growthCurvePrediction;
        
        if (age >= adultAge) {
            growthCurvePrediction = currentHeight;
        } else {
            // 年齢による成長率（簡易的な計算）
            const growthRate = getGrowthRate(age, gender);
            const remainingGrowth = (adultAge - age) * growthRate;
            growthCurvePrediction = currentHeight + remainingGrowth;
        }

        // 最終予測身長（遺伝的予測と成長曲線予測の加重平均）
        const finalPrediction = (geneticPrediction * 0.6 + growthCurvePrediction * 0.4);
        
        // 成長可能性
        const growthPotential = Math.max(0, finalPrediction - currentHeight);

        // 身長の位置づけ（パーセンタイル）
        const percentile = getHeightPercentile(currentHeight, age, gender);

        // 結果表示
        document.getElementById('predicted-height').textContent = finalPrediction.toFixed(1);
        document.getElementById('prediction-description').textContent = `${age}歳${gender === 'male' ? '男性' : '女性'}の成人時予測身長です。`;
        document.getElementById('current-height-display').textContent = currentHeight.toFixed(1);
        document.getElementById('growth-potential').textContent = growthPotential.toFixed(1);
        document.getElementById('parents-average').textContent = parentsAverage.toFixed(1);
        document.getElementById('height-percentile').textContent = getPercentileDescription(percentile);

        // チャートの描画
        createGrowthChart(age, currentHeight, finalPrediction, gender);

        // 計算結果を保存
        calculationResult = {
            gender: gender,
            age: age,
            predictedHeight: finalPrediction.toFixed(1),
            growthPotential: growthPotential.toFixed(1)
        };
    }

    function getGrowthRate(age, gender) {
        // 年齢別の年間成長率（cm/年）の概算
        const maleGrowthRates = {
            0: 25, 1: 12, 2: 8, 3: 7, 4: 6, 5: 6, 6: 6, 7: 6, 8: 5, 9: 5,
            10: 5, 11: 6, 12: 7, 13: 9, 14: 8, 15: 5, 16: 3, 17: 1
        };
        const femaleGrowthRates = {
            0: 25, 1: 12, 2: 8, 3: 7, 4: 6, 5: 6, 6: 6, 7: 6, 8: 5, 9: 6,
            10: 7, 11: 8, 12: 7, 13: 5, 14: 3, 15: 1, 16: 0.5, 17: 0.5
        };

        const rates = gender === 'male' ? maleGrowthRates : femaleGrowthRates;
        return rates[age] || 0;
    }

    function getHeightPercentile(height, age, gender) {
        // 簡易的なパーセンタイル計算（実際にはより詳細な成長曲線データが必要）
        const averageHeights = {
            male: {
                10: 140, 11: 145, 12: 152, 13: 160, 14: 165, 15: 169, 16: 171, 17: 172, 18: 172
            },
            female: {
                10: 140, 11: 147, 12: 152, 13: 156, 14: 158, 15: 158, 16: 158, 17: 158, 18: 158
            }
        };

        const avgHeight = averageHeights[gender][age] || (gender === 'male' ? 172 : 158);
        const difference = height - avgHeight;
        
        // 標準偏差を約6cmと仮定
        const percentile = 50 + (difference / 6) * 15;
        return Math.max(5, Math.min(95, percentile));
    }

    function getPercentileDescription(percentile) {
        if (percentile < 25) return '平均より低め';
        if (percentile < 75) return '平均的';
        return '平均より高め';
    }

    function createGrowthChart(currentAge, currentHeight, predictedHeight, gender) {
        const ctx = document.getElementById('growth-chart').getContext('2d');
        
        if (chart) {
            chart.destroy();
        }

        // チャート用のデータ生成
        const ages = [];
        const personalHeights = [];
        const averageHeights = [];

        for (let age = Math.max(0, currentAge - 5); age <= 20; age++) {
            ages.push(age);
            
            if (age <= currentAge) {
                // 過去の推定身長（簡易的な逆算）
                let estimatedHeight = currentHeight;
                for (let a = age; a < currentAge; a++) {
                    estimatedHeight -= getGrowthRate(a, gender);
                }
                personalHeights.push(Math.max(0, estimatedHeight));
            } else if (age <= 18) {
                // 未来の予測身長
                let futureHeight = currentHeight;
                for (let a = currentAge; a < age; a++) {
                    futureHeight += getGrowthRate(a, gender);
                }
                personalHeights.push(Math.min(predictedHeight, futureHeight));
            } else {
                personalHeights.push(predictedHeight);
            }

            // 平均身長（簡易データ）
            const avgData = {
                male: { 0: 50, 5: 110, 10: 140, 15: 169, 18: 172, 20: 172 },
                female: { 0: 50, 5: 110, 10: 140, 15: 158, 18: 158, 20: 158 }
            };
            
            const avg = avgData[gender];
            let avgHeight = 0;
            const keys = Object.keys(avg).map(Number).sort((a, b) => a - b);
            
            for (let i = 0; i < keys.length - 1; i++) {
                if (age >= keys[i] && age <= keys[i + 1]) {
                    const ratio = (age - keys[i]) / (keys[i + 1] - keys[i]);
                    avgHeight = avg[keys[i]] + (avg[keys[i + 1]] - avg[keys[i]]) * ratio;
                    break;
                }
            }
            
            if (age >= keys[keys.length - 1]) avgHeight = avg[keys[keys.length - 1]];
            averageHeights.push(avgHeight);
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ages.map(age => `${age}歳`),
                datasets: [
                    {
                        label: 'あなたの成長予測',
                        data: personalHeights,
                        borderColor: '#007AFF',
                        backgroundColor: 'rgba(0, 122, 255, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#007AFF',
                        pointBorderColor: '#FFFFFF',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    },
                    {
                        label: '平均的な成長',
                        data: averageHeights,
                        borderColor: '#5856D6',
                        backgroundColor: 'rgba(88, 86, 214, 0.1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 3
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '年齢'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '身長 (cm)'
                        },
                        beginAtZero: false
                    }
                }
            }
        });
    }
}); 