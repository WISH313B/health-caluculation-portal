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
        // 実際のサイトのURL構造に合わせて生成
        const path = window.location.pathname;
        const fileName = path.split('/').pop().replace('.html', '');
        return `https://minna-no-kenko.com/calculators/pages/${fileName}`;
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
        
        // パーソナル・アドバイス機能を呼び出し
        displayPersonalAdvice(bmi, height, weight, category);
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
    
    // パーソナル・アドバイス機能（AdSense審査対応）
    function displayPersonalAdvice(bmi, height, weight, category) {
        const personalAdvice = generatePersonalAdvice(bmi, height, weight, category);
        
        // パーソナル・アドバイス表示エリアを検索
        let adviceContainer = document.getElementById('personal-advice-container');
        if (!adviceContainer) {
            // 結果エリアにコンテナを作成
            adviceContainer = document.createElement('div');
            adviceContainer.id = 'personal-advice-container';
            adviceContainer.className = 'personal-advice-section';
            
            // 結果セクションの最後に追加
            const resultSection = document.getElementById('result-section');
            resultSection.appendChild(adviceContainer);
        }
        
        // アドバイス内容を更新
        adviceContainer.innerHTML = personalAdvice;
    }
    
    // 個人に特化したアドバイス生成関数
    function generatePersonalAdvice(bmi, height, weight, category) {
        const heightInMeters = height / 100;
        const idealWeight = 22 * heightInMeters * heightInMeters; // BMI22を理想体重として計算
        const weightDifference = weight - idealWeight;
        
        // BMI値に基づく基本アドバイス
        let mainAdvice = '';
        let specificActions = [];
        let riskFactors = [];
        let recommendedTools = [];
        
        if (bmi < 18.5) {
            // 低体重
            mainAdvice = `あなたのBMI（${bmi.toFixed(1)}）は低体重に分類されます。健康的な体重増加を目指しましょう。`;
            specificActions = [
                '栄養価の高い食事を1日3回規則正しく摂取',
                '筋力トレーニングを週2-3回実施して筋肉量を増やす',
                'タンパク質を意識的に摂取（体重1kgあたり1.2-1.6g）',
                '十分な休息と睡眠を確保（7-8時間）'
            ];
            riskFactors = ['免疫力低下', '骨密度低下', '疲労感', '集中力低下'];
            recommendedTools = ['基礎代謝量計算機', '食事カロリー計算機', '理想体重計算機'];
        } else if (bmi < 25) {
            // 普通体重
            mainAdvice = `あなたのBMI（${bmi.toFixed(1)}）は普通体重の範囲内です。現在の健康的な体重を維持しましょう。`;
            specificActions = [
                '現在の食事パターンを継続',
                '週150分の中強度運動または週75分の高強度運動を実施',
                '定期的な体重測定で変化をモニタリング',
                'ストレス管理と質の良い睡眠を心がける'
            ];
            riskFactors = ['現在は健康的な範囲内です'];
            recommendedTools = ['基礎代謝量計算機', '運動消費カロリー計算機', '目標心拍数計算機'];
        } else if (bmi < 30) {
            // 肥満度1
            mainAdvice = `あなたのBMI（${bmi.toFixed(1)}）は肥満度1に分類されます。${Math.abs(weightDifference).toFixed(1)}kg程度の減量を目標に、段階的な生活習慣の改善を始めましょう。`;
            specificActions = [
                '1日の摂取カロリーを基礎代謝量の1.2-1.5倍に調整',
                '有酸素運動（ウォーキング、水泳など）を週3-4回実施',
                '食事日記をつけて食習慣を可視化',
                '間食を控え、食事の回数を規則正しく'
            ];
            riskFactors = ['糖尿病リスク増加', '高血圧', '脂質異常症', '心血管疾患'];
            recommendedTools = ['1日の消費カロリー計算機', '食事カロリー計算機', '運動消費カロリー計算機'];
        } else if (bmi < 35) {
            // 肥満度2
            mainAdvice = `あなたのBMI（${bmi.toFixed(1)}）は肥満度2に分類されます。${Math.abs(weightDifference).toFixed(1)}kg程度の減量が推奨されます。医療従事者のサポートを受けながら、計画的な体重管理を行いましょう。`;
            specificActions = [
                '医師または管理栄養士に相談して個別プランを作成',
                '週300分以上の中強度運動を目標に段階的に増加',
                '行動変容技法を用いた食事療法の実践',
                '定期的な健康診断で合併症をチェック'
            ];
            riskFactors = ['2型糖尿病', '高血圧', '脂質異常症', '睡眠時無呼吸症候群', '関節疾患'];
            recommendedTools = ['1日の消費カロリー計算機', '体脂肪率計算機', '目標心拍数計算機'];
        } else {
            // 肥満度3以上
            mainAdvice = `あなたのBMI（${bmi.toFixed(1)}）は肥満度3に分類されます。健康リスクが高い状態です。必ず医療機関を受診し、専門家の指導のもとで体重管理を行いましょう。`;
            specificActions = [
                '速やかに医療機関（肥満外来など）を受診',
                '医師の指導のもとで運動療法を開始',
                '管理栄養士による個別の食事療法を実施',
                '必要に応じて薬物療法や外科療法を検討'
            ];
            riskFactors = ['重篤な糖尿病', '心血管疾患', '脳血管疾患', '睡眠時無呼吸症候群', '関節疾患', '一部のがん'];
            recommendedTools = ['基礎代謝量計算機', '1日の消費カロリー計算機', '体脂肪率計算機'];
        }
        
        // 個人の身長に基づく具体的なアドバイス
        let heightSpecificAdvice = '';
        if (height < 160) {
            heightSpecificAdvice = `あなたの身長（${height}cm）では、少しの体重変化でもBMIに大きく影響します。月1kg程度の緩やかな体重管理が効果的です。`;
        } else if (height > 175) {
            heightSpecificAdvice = `あなたの身長（${height}cm）では、適正体重の範囲も広くなります。筋肉量も考慮した体組成管理が重要です。`;
        } else {
            heightSpecificAdvice = `あなたの身長（${height}cm）は平均的な範囲内です。BMI値と体脂肪率を組み合わせて健康管理を行いましょう。`;
        }
        
        // HTML生成
        return `
            <div class="personal-advice-content">
                <div class="advice-header">
                    <h3><i class="fas fa-user-md"></i> あなただけのパーソナルアドバイス</h3>
                    <p class="advice-subtitle">身長${height}cm、体重${weight}kg、BMI${bmi.toFixed(1)}の方へ</p>
                </div>
                
                <div class="main-advice">
                    <h4><i class="fas fa-lightbulb"></i> 現在の状況</h4>
                    <p>${mainAdvice}</p>
                    <p>${heightSpecificAdvice}</p>
                </div>
                
                <div class="action-plan">
                    <h4><i class="fas fa-clipboard-check"></i> 今すぐ始められる具体的なアクション</h4>
                    <ul>
                        ${specificActions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="risk-awareness">
                    <h4><i class="fas fa-exclamation-triangle"></i> 注意すべき健康リスク</h4>
                    <p>${riskFactors.join('、')}などのリスクが考えられます。定期的な健康診断を受けて、早期発見・早期対処を心がけましょう。</p>
                </div>
                
                <div class="recommended-tools">
                    <h4><i class="fas fa-tools"></i> 併用をお勧めする計算機</h4>
                    <div class="tool-links">
                        ${recommendedTools.map(tool => {
                            let url = '';
                            switch(tool) {
                                case '基礎代謝量計算機':
                                    url = 'bmr.html';
                                    break;
                                case '食事カロリー計算機':
                                    url = 'meal-calories.html';
                                    break;
                                case '理想体重計算機':
                                    url = 'ideal-weight.html';
                                    break;
                                case '運動消費カロリー計算機':
                                    url = 'calories-burned.html';
                                    break;
                                case '1日の消費カロリー計算機':
                                    url = 'tdee.html';
                                    break;
                                case '体脂肪率計算機':
                                    url = 'body-fat.html';
                                    break;
                                case '目標心拍数計算機':
                                    url = 'target-heart-rate.html';
                                    break;
                                default:
                                    url = 'bmi.html';
                            }
                            return `
                                <a href="${url}" class="tool-link">
                                    <i class="fas fa-calculator"></i> ${tool}
                                </a>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div class="medical-disclaimer">
                    <p><i class="fas fa-info-circle"></i> <strong>重要：</strong>このアドバイスは一般的な情報提供を目的としています。個人の健康状態や医療ニーズについては、必ず医療従事者にご相談ください。</p>
                </div>
            </div>
            
            <style>
                .personal-advice-section {
                    margin-top: 2rem;
                    background: linear-gradient(135deg, #f8f9fa, #ffffff);
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    border: 2px solid #e3f2fd;
                }
                
                .advice-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                
                .advice-header h3 {
                    color: var(--primary-color);
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                
                .advice-subtitle {
                    color: var(--secondary-color);
                    font-weight: bold;
                    font-size: 1.1rem;
                }
                
                .main-advice, .action-plan, .risk-awareness, .recommended-tools {
                    margin-bottom: 2rem;
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }
                
                .main-advice h4, .action-plan h4, .risk-awareness h4, .recommended-tools h4 {
                    color: var(--primary-color);
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .action-plan ul {
                    list-style: none;
                    padding: 0;
                }
                
                .action-plan li {
                    padding: 0.8rem 0;
                    border-bottom: 1px solid #f0f0f0;
                    position: relative;
                    padding-left: 1.5rem;
                }
                
                .action-plan li:before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    color: var(--primary-color);
                    font-weight: bold;
                }
                
                .tool-links {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                
                .tool-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--primary-color);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                }
                
                .tool-link:hover {
                    background: var(--secondary-color);
                    transform: translateY(-2px);
                }
                
                .medical-disclaimer {
                    background: #fff3e0;
                    padding: 1rem;
                    border-radius: 8px;
                    border-left: 4px solid #ff9800;
                    margin-top: 1rem;
                }
                
                .medical-disclaimer p {
                    margin: 0;
                    font-size: 0.9rem;
                    color: #bf6000;
                }
                
                @media (max-width: 768px) {
                    .personal-advice-section {
                        padding: 1rem;
                    }
                    
                    .tool-links {
                        flex-direction: column;
                    }
                    
                    .tool-link {
                        justify-content: center;
                    }
                }
            </style>
        `;
    }
}); 